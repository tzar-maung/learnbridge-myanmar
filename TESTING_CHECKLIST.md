# LearnBridge Myanmar Testing Checklist

Use this checklist before sharing the prototype with a pilot group.

## Basic Setup

- [ ] Local server starts without errors.
- [ ] App opens at `http://127.0.0.1:4173/?fresh=50`.
- [ ] Page shows LearnBridge Myanmar.
- [ ] Online/offline status appears in the header.
- [ ] Header tabs show Learn, Teach, Home, and Library.

## Independent Learn

- [ ] Safe nickname can be entered.
- [ ] Save learner updates the welcome message.
- [ ] Continue Practice shows the first incomplete activity.
- [ ] Open next activity opens the activity reader.
- [ ] Back to activities returns to the activity list.
- [ ] Mark activity complete updates independent learner progress only.
- [ ] Completed activity card changes state.
- [ ] Only useful skill subjects appear in the independent learning list.

## Activity Library

- [ ] All 12 activity cards appear.
- [ ] Subject filter shows all activity subjects.
- [ ] Filtering by each subject shows the correct activity cards.
- [ ] Each activity opens with title, subject, level, content, and sources where available.
- [ ] Teacher guidance does not appear inside the learner-facing activity reader.

## Library

- [ ] Library tab opens the resource library.
- [ ] Resource categories appear.
- [ ] External resource links open in a new tab while online.
- [ ] Offline setup checklist explains that outside files must be downloaded separately.

## Teach

- [ ] Teach tab opens Teaching Desk.
- [ ] Existing progress appears under the migrated **Main class** batch.
- [ ] A new batch can be created with a general name and approximate learner count.
- [ ] Switching batches changes the completed and remaining activity counts.
- [ ] Marking a suggested activity in Teach affects only the selected batch.
- [ ] Class notes appear only under the batch where they were saved.
- [ ] Activity, completed, and remaining counts are correct.
- [ ] Load class material file picker is visible.
- [ ] A downloaded image can be shown in the file viewer.
- [ ] A downloaded PDF can be selected for the file viewer.
- [ ] A selected PDF or image can be saved under **My offline materials**.
- [ ] A saved material remains listed after refreshing the page.
- [ ] A saved material opens from the device library while offline.
- [ ] **Full screen** expands an open PDF or image and `Esc` returns to the Teaching Desk.
- [ ] On a phone or tablet, the browser or device Back button closes full screen without leaving LearnBridge.
- [ ] A saved material can be deleted from the device library.
- [ ] Clear material resets the file viewer.
- [ ] Class notebook saves a group note.
- [ ] Saved class notes remain after refresh.
- [ ] Saved class notes can be deleted.
- [ ] Teaching notes appear for each activity.
- [ ] Export pilot report downloads a text file without private child data.

## Home Learning

- [ ] Home tab opens suggested learning paths for adults and children.
- [ ] Saving a nickname and age range updates the local home profile.
- [ ] Changing the age range filters the suggested paths.
- [ ] Choosing a path updates the current home plan.
- [ ] Home profile and selected path remain after refresh.

## Reset Progress

- [ ] Reset current batch progress asks for confirmation and names the selected batch.
- [ ] Cancel keeps progress unchanged.
- [ ] Confirm clears completed activities only for the selected batch.
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
