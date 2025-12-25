-- Fix the get_test_questions_without_answers function to handle column name variations properly
CREATE OR REPLACE FUNCTION public.get_test_questions_without_answers(test_name_param text)
 RETURNS TABLE(id bigint, question_text text, option_1 text, option_2 text, option_3 text, option_4 text, marks numeric, negative_marks numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  query_text text;
  has_s_no_dot boolean := false;
BEGIN
  -- Check if this table uses "S.No." (with dot) column name
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = test_name_param 
    AND column_name = 'S.No.'
  ) INTO has_s_no_dot;
  
  IF has_s_no_dot THEN
    -- Table uses "S.No." column
    RETURN QUERY EXECUTE format(
      'SELECT 
        t."S.No."::bigint as id,
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
      ORDER BY t."S.No." ASC
      LIMIT 100',
      test_name_param,
      test_name_param,
      test_name_param
    );
  ELSE
    -- Table uses "S. No" column (with space, no dot)
    RETURN QUERY EXECUTE format(
      'SELECT 
        t."S. No"::bigint as id,
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
      ORDER BY t."S. No" ASC
      LIMIT 100',
      test_name_param,
      test_name_param,
      test_name_param
    );
  END IF;
END;
$function$;

-- Also fix the submit_test_answers function
CREATE OR REPLACE FUNCTION public.submit_test_answers(p_user_id uuid, p_test_name text, p_answers jsonb, p_time_taken integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  v_has_s_no_dot boolean;
BEGIN
  v_is_ssc_gd := p_test_name LIKE 'SSC GD%';
  
  -- Check if this table uses "S.No." column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = p_test_name 
    AND column_name = 'S.No.'
  ) INTO v_has_s_no_dot;
  
  IF v_has_s_no_dot THEN
    -- Loop through each question using "S.No." column
    FOR v_question IN EXECUTE format(
      'SELECT 
        t."S.No."::integer as id,
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
      ORDER BY t."S.No." ASC',
      p_test_name,
      p_test_name,
      p_test_name
    )
    LOOP
      v_marks := v_question.marks;
      v_negative_marks := v_question.negative_marks;
      v_max_score := v_max_score + v_marks;
      
      -- Parse correct option
      v_correct_option := CASE 
        WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'A' THEN 1
        WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'B' THEN 2
        WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'C' THEN 3
        WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'D' THEN 4
        ELSE v_question.correct_option::integer
      END;
      
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
  ELSE
    -- Loop through each question using "S. No" column
    FOR v_question IN EXECUTE format(
      'SELECT 
        t."S. No"::integer as id,
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
      ORDER BY t."S. No" ASC',
      p_test_name,
      p_test_name,
      p_test_name
    )
    LOOP
      v_marks := v_question.marks;
      v_negative_marks := v_question.negative_marks;
      v_max_score := v_max_score + v_marks;
      
      -- Parse correct option
      v_correct_option := CASE 
        WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'A' THEN 1
        WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'B' THEN 2
        WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'C' THEN 3
        WHEN UPPER(TRIM(REPLACE(REPLACE(v_question.correct_option, '(', ''), ')', ''))) = 'D' THEN 4
        ELSE v_question.correct_option::integer
      END;
      
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
  END IF;
  
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
$function$;

-- Also fix get_test_solutions function
CREATE OR REPLACE FUNCTION public.get_test_solutions(p_user_id uuid, p_test_name text)
 RETURNS TABLE(id bigint, question_text text, option_1 text, option_2 text, option_3 text, option_4 text, correct_option text, marks numeric, negative_marks numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_has_attempted boolean;
  v_has_s_no_dot boolean;
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
  
  -- Check if this table uses "S.No." column
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = p_test_name 
    AND column_name = 'S.No.'
  ) INTO v_has_s_no_dot;
  
  IF v_has_s_no_dot THEN
    RETURN QUERY EXECUTE format(
      'SELECT 
        t."S.No."::bigint as id,
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
      ORDER BY t."S.No." ASC
      LIMIT 100',
      p_test_name,
      p_test_name,
      p_test_name
    );
  ELSE
    RETURN QUERY EXECUTE format(
      'SELECT 
        t."S. No"::bigint as id,
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
      ORDER BY t."S. No" ASC
      LIMIT 100',
      p_test_name,
      p_test_name,
      p_test_name
    );
  END IF;
END;
$function$;