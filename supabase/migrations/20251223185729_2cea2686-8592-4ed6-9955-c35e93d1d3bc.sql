-- Fix: Update get_test_questions_without_answers to handle NULL column names for SSC GD tests
CREATE OR REPLACE FUNCTION public.get_test_questions_without_answers(test_name_param text)
 RETURNS TABLE(id bigint, question_text text, option_1 text, option_2 text, option_3 text, option_4 text, marks numeric, negative_marks numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_id_col text;
  v_question_col text;
  v_opt1_col text;
  v_opt2_col text;
  v_opt3_col text;
  v_opt4_col text;
  v_marks_col text;
  v_neg_marks_col text;
  v_is_ssc_gd boolean;
  v_query text;
BEGIN
  v_is_ssc_gd := test_name_param LIKE 'SSC GD%';
  
  -- Detect ID column
  SELECT column_name INTO v_id_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = test_name_param 
  AND column_name IN ('S. No', 'S.No.') LIMIT 1;
  
  -- Detect question column
  SELECT column_name INTO v_question_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = test_name_param 
  AND column_name IN ('question_text', 'Question', 'Question Text') LIMIT 1;
  
  -- Detect option columns
  SELECT column_name INTO v_opt1_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = test_name_param 
  AND column_name IN ('option_1', 'Option A', 'Option1') LIMIT 1;
  
  SELECT column_name INTO v_opt2_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = test_name_param 
  AND column_name IN ('option_2', 'Option B', 'Option2') LIMIT 1;
  
  SELECT column_name INTO v_opt3_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = test_name_param 
  AND column_name IN ('option_3', 'Option C', 'Option3') LIMIT 1;
  
  SELECT column_name INTO v_opt4_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = test_name_param 
  AND column_name IN ('option_4', 'Option D', 'Option4') LIMIT 1;
  
  -- Detect marks columns (may be NULL for SSC GD)
  SELECT column_name INTO v_marks_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = test_name_param 
  AND column_name IN ('marks', 'Mark') LIMIT 1;
  
  SELECT column_name INTO v_neg_marks_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = test_name_param 
  AND column_name IN ('negative_marks', 'Negative Mark', 'Negative marks') LIMIT 1;
  
  -- Build query based on whether SSC GD (use hardcoded marks) or regular test
  IF v_is_ssc_gd THEN
    -- SSC GD: Use hardcoded marks values, don't reference marks columns
    v_query := format(
      'SELECT 
        t.%I::bigint as id,
        t.%I::text as question_text,
        t.%I::text as option_1,
        t.%I::text as option_2,
        t.%I::text as option_3,
        t.%I::text as option_4,
        2::numeric as marks,
        0.5::numeric as negative_marks
      FROM %I t
      ORDER BY t.%I ASC
      LIMIT 100',
      v_id_col,
      v_question_col,
      v_opt1_col,
      v_opt2_col,
      v_opt3_col,
      v_opt4_col,
      test_name_param,
      v_id_col
    );
  ELSE
    -- Regular test: Use marks columns
    v_query := format(
      'SELECT 
        t.%I::bigint as id,
        t.%I::text as question_text,
        t.%I::text as option_1,
        t.%I::text as option_2,
        t.%I::text as option_3,
        t.%I::text as option_4,
        COALESCE(t.%I, 1)::numeric as marks,
        COALESCE(t.%I, 0.25)::numeric as negative_marks
      FROM %I t
      ORDER BY t.%I ASC
      LIMIT 100',
      v_id_col,
      v_question_col,
      v_opt1_col,
      v_opt2_col,
      v_opt3_col,
      v_opt4_col,
      v_marks_col,
      v_neg_marks_col,
      test_name_param,
      v_id_col
    );
  END IF;
  
  RETURN QUERY EXECUTE v_query;
END;
$function$;

-- Fix: Update get_test_solutions to handle NULL column names for SSC GD tests
CREATE OR REPLACE FUNCTION public.get_test_solutions(p_user_id uuid, p_test_name text)
 RETURNS TABLE(id bigint, question_text text, option_1 text, option_2 text, option_3 text, option_4 text, correct_option text, marks numeric, negative_marks numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_has_attempted boolean;
  v_id_col text;
  v_question_col text;
  v_opt1_col text;
  v_opt2_col text;
  v_opt3_col text;
  v_opt4_col text;
  v_correct_col text;
  v_marks_col text;
  v_neg_marks_col text;
  v_is_ssc_gd boolean;
  v_query text;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.test_attempts 
    WHERE user_id = p_user_id AND test_name = p_test_name
  ) INTO v_has_attempted;
  
  IF NOT v_has_attempted THEN
    RAISE EXCEPTION 'You must complete the test before viewing solutions';
  END IF;
  
  v_is_ssc_gd := p_test_name LIKE 'SSC GD%';
  
  -- Detect columns
  SELECT column_name INTO v_id_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('S. No', 'S.No.') LIMIT 1;
  
  SELECT column_name INTO v_question_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('question_text', 'Question', 'Question Text') LIMIT 1;
  
  SELECT column_name INTO v_opt1_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('option_1', 'Option A', 'Option1') LIMIT 1;
  
  SELECT column_name INTO v_opt2_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('option_2', 'Option B', 'Option2') LIMIT 1;
  
  SELECT column_name INTO v_opt3_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('option_3', 'Option C', 'Option3') LIMIT 1;
  
  SELECT column_name INTO v_opt4_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('option_4', 'Option D', 'Option4') LIMIT 1;
  
  SELECT column_name INTO v_correct_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('correct_option', 'Correct Option', 'correct_answer', 'correct_option_index') LIMIT 1;
  
  SELECT column_name INTO v_marks_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('marks', 'Mark') LIMIT 1;
  
  SELECT column_name INTO v_neg_marks_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('negative_marks', 'Negative Mark', 'Negative marks') LIMIT 1;
  
  -- Build query based on whether SSC GD (use hardcoded marks) or regular test
  IF v_is_ssc_gd THEN
    -- SSC GD: Use hardcoded marks values
    v_query := format(
      'SELECT 
        t.%I::bigint as id,
        t.%I::text as question_text,
        t.%I::text as option_1,
        t.%I::text as option_2,
        t.%I::text as option_3,
        t.%I::text as option_4,
        t.%I::text as correct_option,
        2::numeric as marks,
        0.5::numeric as negative_marks
      FROM %I t
      ORDER BY t.%I ASC
      LIMIT 100',
      v_id_col,
      v_question_col,
      v_opt1_col,
      v_opt2_col,
      v_opt3_col,
      v_opt4_col,
      v_correct_col,
      p_test_name,
      v_id_col
    );
  ELSE
    -- Regular test: Use marks columns
    v_query := format(
      'SELECT 
        t.%I::bigint as id,
        t.%I::text as question_text,
        t.%I::text as option_1,
        t.%I::text as option_2,
        t.%I::text as option_3,
        t.%I::text as option_4,
        t.%I::text as correct_option,
        COALESCE(t.%I, 1)::numeric as marks,
        COALESCE(t.%I, 0.25)::numeric as negative_marks
      FROM %I t
      ORDER BY t.%I ASC
      LIMIT 100',
      v_id_col,
      v_question_col,
      v_opt1_col,
      v_opt2_col,
      v_opt3_col,
      v_opt4_col,
      v_correct_col,
      v_marks_col,
      v_neg_marks_col,
      p_test_name,
      v_id_col
    );
  END IF;
  
  RETURN QUERY EXECUTE v_query;
END;
$function$;

-- Fix: Update submit_test_answers to handle NULL column names for SSC GD tests
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
  v_id_col text;
  v_correct_col text;
  v_marks_col text;
  v_neg_marks_col text;
  v_query text;
BEGIN
  v_is_ssc_gd := p_test_name LIKE 'SSC GD%';
  
  -- Detect columns
  SELECT column_name INTO v_id_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('S. No', 'S.No.') LIMIT 1;
  
  SELECT column_name INTO v_correct_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('correct_option', 'Correct Option', 'correct_answer', 'correct_option_index') LIMIT 1;
  
  SELECT column_name INTO v_marks_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('marks', 'Mark') LIMIT 1;
  
  SELECT column_name INTO v_neg_marks_col FROM information_schema.columns 
  WHERE table_schema = 'public' AND table_name = p_test_name 
  AND column_name IN ('negative_marks', 'Negative Mark', 'Negative marks') LIMIT 1;
  
  -- Build query based on whether SSC GD or regular test
  IF v_is_ssc_gd THEN
    v_query := format(
      'SELECT 
        t.%I::integer as id,
        t.%I::text as correct_option,
        2::numeric as marks,
        0.5::numeric as negative_marks
      FROM %I t
      ORDER BY t.%I ASC',
      v_id_col,
      v_correct_col,
      p_test_name,
      v_id_col
    );
  ELSE
    v_query := format(
      'SELECT 
        t.%I::integer as id,
        t.%I::text as correct_option,
        COALESCE(t.%I, 1)::numeric as marks,
        COALESCE(t.%I, 0.25)::numeric as negative_marks
      FROM %I t
      ORDER BY t.%I ASC',
      v_id_col,
      v_correct_col,
      v_marks_col,
      v_neg_marks_col,
      p_test_name,
      v_id_col
    );
  END IF;
  
  FOR v_question IN EXECUTE v_query
  LOOP
    v_marks := v_question.marks;
    v_negative_marks := v_question.negative_marks;
    v_max_score := v_max_score + v_marks;
    
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
  
  v_percentage := CASE WHEN v_max_score > 0 THEN (GREATEST(v_score, 0) / v_max_score) * 100 ELSE 0 END;
  
  INSERT INTO public.test_attempts (
    user_id, test_name, score, max_score, percentage,
    correct_answers, wrong_answers, unattempted, time_taken
  ) VALUES (
    p_user_id, p_test_name, GREATEST(v_score, 0), v_max_score,
    GREATEST(v_percentage, 0), v_correct, v_wrong, v_unattempted, p_time_taken
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