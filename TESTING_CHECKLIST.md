# LearnBridge Myanmar Testing Checklist

Use this checklist before sharing the prototype with a pilot group.

## Basic Setup

- [ ] Local server starts without errors.
- [ ] App opens at `http://127.0.0.1:4173/?fresh=44`.
- [ ] Page shows LearnBridge Myanmar.
- [ ] Online/offline status appears in the header.
- [ ] Header tabs show Practice, Resources, Teach, and Safety.

## Practice

- [ ] Safe nickname can be entered.
- [ ] Save learner updates the welcome message.
- [ ] Continue Practice shows the first incomplete activity.
- [ ] Open next activity opens the activity reader.
- [ ] Back to activities returns to the activity list.
- [ ] Mark activity complete updates progress.
- [ ] Completed activity card changes state.
- [ ] Quick check gives correct/incorrect feedback.

## Activity Library

- [ ] All 12 activity cards appear.
- [ ] Subject filter shows all activity subjects.
- [ ] Filtering by each subject shows the correct activity cards.
- [ ] Each activity opens with title, subject, level, content, and sources where available.
- [ ] Teacher guidance does not appear inside the learner-facing activity reader.

## Resources

- [ ] Resources tab opens the Download Library.
- [ ] Resource categories appear.
- [ ] External resource links open in a new tab while online.
- [ ] Offline setup checklist explains that outside files must be downloaded separately.

## Teach

- [ ] Teach tab opens Teaching Desk.
- [ ] Activity, completed, and remaining counts are correct.
- [ ] Load class material file picker is visible.
- [ ] A downloaded image can be shown in the file viewer.
- [ ] A downloaded PDF can be selected for the file viewer.
- [ ] Clear material resets the file viewer.
- [ ] Class notebook saves a group note.
- [ ] Saved class notes remain after refresh.
- [ ] Saved class notes can be deleted.
- [ ] Teaching notes appear for each activity.
- [ ] Export pilot report downloads a text file without private child data.

## Safety

- [ ] Safety tab opens the Offline Safety Kit.
- [ ] Safety guidance is calm and non-graphic.
- [ ] Safety guidance avoids tactical or military instructions.
- [ ] Sensitive safety content is marked for local review in lessons where needed.

## Reset Progress

- [ ] Reset progress asks for confirmation.
- [ ] Cancel keeps progress unchanged.
- [ ] Confirm clears completed activities.
- [ ] Progress returns to 0 completed activities.
- [ ] Continue Practice returns to the first activity.

## Offline Behavior

- [ ] App loads once while online/local server is available.
- [ ] Browser refresh still works after files are cached.
- [ ] Activity data appears after refresh.
- [ ] Cache version is bumped when app files change.

## Privacy Review

- [ ] App does not ask for real full names.
- [ ] App does not ask for phone numbers.
- [ ] App does not ask for document numbers.
- [ ] App does not ask for address or location.
- [ ] Notebook guidance warns against private child or family data.
- [ ] Exported report does not include private fields.

## Content Review

- [ ] Activity language is age-appropriate.
- [ ] Teaching notes are clear for volunteers.
- [ ] Local educators have reviewed sensitive content.
- [ ] Translation needs are documented.
