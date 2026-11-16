-- seed-data/questions.sql : STARTER questions so a fresh database works end to end.
-- !! PLACEHOLDER WORDING !! Replace with the campaign's approved questions
-- (use Admin -> Questions, or edit this file) before any public activation.
-- Safe to re-run: skips a question if the same text already exists for that pathway.

INSERT INTO questions (script_key, title, question_text, placeholder, sort_order)
SELECT v.script_key, v.title, v.question_text, v.placeholder, v.sort_order
FROM (VALUES
  ('men_mental_health','Check-in',   'PLACEHOLDER: How have you really been lately?',                'Type or speak your answer here...', 1),
  ('men_mental_health','Support',    'PLACEHOLDER: Who do you talk to when things get heavy?',       'Type or speak your answer here...', 2),
  ('ally_support',     'Noticing',   'PLACEHOLDER: What have you noticed about a man in your life?', 'Type or speak your answer here...', 1),
  ('ally_support',     'Message',    'PLACEHOLDER: What would you like him to hear from you?',       'Type or speak your answer here...', 2),
  ('fast_track_activations','Quick', 'PLACEHOLDER: In a sentence, what is on your mind today?',      'Type or speak your answer here...', 1)
) AS v(script_key, title, question_text, placeholder, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM questions q
  WHERE q.script_key = v.script_key AND q.question_text = v.question_text
);
-- Quiz questions are intentionally NOT seeded: health facts need a cited source
-- and clinical review first (see FIX-17).
