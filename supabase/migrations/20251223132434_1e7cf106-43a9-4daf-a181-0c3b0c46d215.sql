-- Create a function to get test questions WITHOUT correct answers (for taking the test)
CREATE OR REPLACE FUNCTION public.get_test_questions_without_answers(test_name_param text)
RETURNS TABLE (
  id bigint,
  question_text text,
  option_1 text,
  option_2 text,
  option_3 text,
  option_4 text,
  marks numeric,
  negative_marks numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Dynamically query the appropriate table based on test name
  -- Return all columns EXCEPT correct_option/correct_answer
  RETURN QUERY EXECUTE format(
    'SELECT 
      COALESCE(t."S. No", t."S.No.")::bigint as id,
      COALESCE(t.question_text, t."Question", t."Question Text")::text as question_text,
      COALESCE(t.option_1, t."Option A", t."Option1")::text as option_1,
      COALESCE(t.option_2, t."Option B", t."Option2")::text as option_2,
      COALESCE(t.option_3, t."Option C", t."Option3")::text as option_3,
      COALESCE(t.option_4, t."Option D", t."Option4")::text as option_4,
      CASE 
        WHEN %L LIKE ''SSC GD%%'' THEN 2::numeric
        ELSE COALESCE(t.marks, t."Mark", 1)::numeric
      END as marks,
      CASE 
        WHEN %L LIKE ''SSC GD%%'' THEN 0.25::numeric
        ELSE COALESCE(t.negative_marks, t."Negative Mark", t."Negative marks", 0.25)::numeric
      END as negative_marks
    FROM %I t
    ORDER BY COALESCE(t."S. No", t."S.No.") ASC
    LIMIT 100',
    test_name_param,
    test_name_param,
    test_name_param
  );
END;
$$;

-- Create a function to submit test answers and calculate score server-side
CREATE OR REPLACE FUNCTION public.submit_test_answers(
  p_user_id uuid,
  p_test_name text,
  p_answers jsonb, -- Format: {"1": 2, "2": 1, "3": null, ...} (question_id: selected_option)
  p_time_taken integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score numeric := 0;
  v_max_score numeric := 0;
  v_correct integer := 0;
  v_wrong integer := 0;
  v_unattempted integer := 0;
  v_percentage numeric;
  v_question record;
  v_user_answer integer;
  v_correct_option integer;
  v_marks numeric;
  v_negative_marks numeric;
  v_is_ssc_gd boolean;
BEGIN
  v_is_ssc_gd := p_test_name LIKE 'SSC GD%';
  
  -- Loop through each question and calculate score
  FOR v_question IN EXECUTE format(
    'SELECT 
      COALESCE(t."S. No", t."S.No.")::integer as id,
      COALESCE(t.correct_option, t."Correct Option", t.correct_answer, t.correct_option_index)::text as correct_option,
      CASE 
        WHEN %L LIKE ''SSC GD%%'' THEN 2::numeric
        ELSE COALESCE(t.marks, t."Mark", 1)::numeric
      END as marks,
      CASE 
        WHEN %L LIKE ''SSC GD%%'' THEN 0.25::numeric
        ELSE COALESCE(t.negative_marks, t."Negative Mark", t."Negative marks", 0.25)::numeric
      END as negative_marks
    FROM %I t
    ORDER BY COALESCE(t."S. No", t."S.No.") ASC',
    p_test_name,
    p_test_name,
    p_test_name
  )
  LOOP
    v_marks := v_question.marks;
    v_negative_marks := v_question.negative_marks;
    v_max_score := v_max_score + v_marks;
    
    -- Parse correct option (handle A/B/C/D and (a)/(b)/(c)/(d) formats)
    v_correct_option := CASE 
      WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'A' THEN 1
      WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'B' THEN 2
      WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'C' THEN 3
      WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'D' THEN 4
      ELSE v_question.correct_option::integer
    END;
    
    -- Get user's answer for this question
    v_user_answer := (p_answers->>v_question.id::text)::integer;
    
    IF v_user_answer IS NULL THEN
      v_unattempted := v_unattempted + 1;
    ELSIF v_user_answer = v_correct_option THEN
      v_correct := v_correct + 1;
      v_score := v_score + v_marks;
    ELSE
      v_wrong := v_wrong + 1;
      v_score := v_score - v_negative_marks;
    END IF;
  END LOOP;
  
  -- Calculate percentage
  v_percentage := CASE WHEN v_max_score > 0 THEN (GREATEST(v_score, 0) / v_max_score) * 100 ELSE 0 END;
  
  -- Insert the test attempt
  INSERT INTO public.test_attempts (
    user_id,
    test_name,
    score,
    max_score,
    percentage,
    correct_answers,
    wrong_answers,
    unattempted,
    time_taken
  ) VALUES (
    p_user_id,
    p_test_name,
    GREATEST(v_score, 0),
    v_max_score,
    GREATEST(v_percentage, 0),
    v_correct,
    v_wrong,
    v_unattempted,
    p_time_taken
  );
  
  RETURN jsonb_build_object(
    'score', GREATEST(v_score, 0),
    'max_score', v_max_score,
    'percentage', GREATEST(v_percentage, 0),
    'correct', v_correct,
    'wrong', v_wrong,
    'unattempted', v_unattempted
  );
END;
$$;

-- Create a function to get questions WITH answers (only for users who completed the test)
CREATE OR REPLACE FUNCTION public.get_test_solutions(
  p_user_id uuid,
  p_test_name text
)
RETURNS TABLE (
  id bigint,
  question_text text,
  option_1 text,
  option_2 text,
  option_3 text,
  option_4 text,
  correct_option text,
  marks numeric,
  negative_marks numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_attempted boolean;
BEGIN
  -- Check if user has attempted this test
  SELECT EXISTS (
    SELECT 1 FROM public.test_attempts 
    WHERE user_id = p_user_id AND test_name = p_test_name
  ) INTO v_has_attempted;
  
  -- Only return solutions if user has completed the test
  IF NOT v_has_attempted THEN
    RAISE EXCEPTION 'You must complete the test before viewing solutions';
  END IF;
  
  RETURN QUERY EXECUTE format(
    'SELECT 
      COALESCE(t."S. No", t."S.No.")::bigint as id,
      COALESCE(t.question_text, t."Question", t."Question Text")::text as question_text,
      COALESCE(t.option_1, t."Option A", t."Option1")::text as option_1,
      COALESCE(t.option_2, t."Option B", t."Option2")::text as option_2,
      COALESCE(t.option_3, t."Option C", t."Option3")::text as option_3,
      COALESCE(t.option_4, t."Option D", t."Option4")::text as option_4,
      COALESCE(t.correct_option, t."Correct Option", t.correct_answer, t.correct_option_index::text)::text as correct_option,
      CASE 
        WHEN %L LIKE ''SSC GD%%'' THEN 2::numeric
        ELSE COALESCE(t.marks, t."Mark", 1)::numeric
      END as marks,
      CASE 
        WHEN %L LIKE ''SSC GD%%'' THEN 0.25::numeric
        ELSE COALESCE(t.negative_marks, t."Negative Mark", t."Negative marks", 0.25)::numeric
      END as negative_marks
    FROM %I t
    ORDER BY COALESCE(t."S. No", t."S.No.") ASC
    LIMIT 100',
    p_test_name,
    p_test_name,
    p_test_name
  );
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_test_questions_without_answers(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_test_answers(uuid, text, jsonb, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_test_solutions(uuid, text) TO authenticated;