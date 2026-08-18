# LearnBridge Myanmar Testing Checklist

Use this checklist before sharing the prototype with a pilot group.

## Basic Setup

- [ ] Local server starts without errors.
- [ ] App opens at `http://127.0.0.1:4173/?fresh=43`.
- [ ] Page shows LearnBridge Myanmar.
- [ ] Online/offline status appears in the header.

## Class View

- [ ] Safe nickname can be entered.
- [ ] Save learner updates the welcome message.
- [ ] Continue Learning shows the first incomplete lesson.
- [ ] Open next lesson opens the lesson reader.
- [ ] Back to lessons returns to the lesson list.
- [ ] Mark lesson complete updates progress.
- [ ] Completed lesson card changes state.

## Lesson Library

- [ ] All 12 activity cards appear.
- [ ] Subject filter shows all lesson subjects.
- [ ] Filtering by each subject shows the correct lesson cards.
- [ ] Each lesson opens with title, subject, level, activity content, teacher note, and sources where available.

## Facilitator View

- [ ] Facilitator button opens Facilitator View.
- [ ] Total lessons count is correct.
- [ ] Completed lessons count is correct.
- [ ] Remaining lessons count is correct.
- [ ] Resource download center appears.
- [ ] Textbook links appear.
- [ ] Downloaded textbook PDF picker is visible.
- [ ] Teacher notes appear for each activity.
- [ ] Class view button returns to Class View.
- [ ] Export pilot report downloads a text file without private child data.

## Reset Progress

- [ ] Reset progress asks for confirmation.
- [ ] Cancel keeps progress unchanged.
- [ ] Confirm clears completed lessons.
- [ ] Progress returns to 0 completed lessons.
- [ ] Continue Learning returns to the first lesson.

## Offline Behavior

- [ ] App loads once while online/local server is available.
- [ ] Browser refresh still works after files are cached.
- [ ] Lesson data appears after refresh.
- [ ] Cache version is bumped when app files change.

## Safety Review

- [ ] App does not ask for real full names.
- [ ] App does not ask for phone numbers.
- [ ] App does not ask for document numbers.
- [ ] App does not ask for address or location.
- [ ] Lessons avoid shame-based or competitive language.
- [ ] Wellbeing content is calm and optional.

## Content Review

- [ ] Lesson language is age-appropriate.
- [ ] Teacher notes are clear for volunteers.
- [ ] Local educators have reviewed sensitive content.
- [ ] Translation needs are documented.
