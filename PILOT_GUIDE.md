# LearnBridge Myanmar Pilot Guide

This guide is for a small, supervised pilot of LearnBridge Myanmar with
teachers, volunteers, or community helpers supporting learners age 12+.

## What This App Is

LearnBridge Myanmar is an offline-first teacher-guided learning kit for shared
devices. It includes catch-up learning activities, progress tracking on the
device, teacher notes, textbook links, and a reset progress option.

## What This App Is Not

- It is not a full school curriculum.
- It is not a child protection reporting tool.
- It is not a medical, legal, or migration advice tool.
- It does not provide cloud backup or multi-device sync.
- It should not be used to collect sensitive child or family information.

## Safety Rules

- Do not enter real full names.
- Do not enter phone numbers, addresses, document numbers, or private family
  details.
- Use safe nicknames only.
- Do not take or store private screenshots of children using the app.
- Review lesson content with local teachers or community members before use.
- Treat lessons marked `Needs local review` as draft material until checked by
  trusted local educators or protection workers.
- Check the Sources section inside upgraded lessons before adapting content.
- Keep activities optional and calm, especially wellbeing activities.

## How To Run The App

Open a terminal in the project folder:

```powershell
cd learnbridge
python -m http.server 4173 --bind 127.0.0.1
```

Then open this address in the browser:

```text
http://127.0.0.1:4173/?fresh=43
```

Keep the terminal open while using the app. To stop the app, click the terminal
and press `Ctrl + C`.

## Offline Setup Check

Before a session, test the device:

1. Start the local server.
2. Open LearnBridge and wait for lessons to load.
3. Open one lesson and return to the lesson list.
4. Mark one lesson complete.
5. Turn off internet or Wi-Fi.
6. Refresh the page.
7. Confirm the app still opens and shows lessons.

## Download Checklist

- LearnBridge itself needs only this project folder, a browser, and Python's
  local server while you are testing on your laptop.
- For offline reading, download Kiwix Reader and chosen ZIM files before the
  session.
- For school textbooks, download the needed PDF files before the session and
  open them from Facilitator View.
- For a larger offline course library, consider Kolibri later.
- Do not assume external links will work offline unless the material was
  downloaded first.

## Suggested Pilot Flow

1. Open the app on one shared device.
2. Choose a safe learner nickname.
3. Choose a subject and open one class activity.
4. Read one lesson together.
5. Mark the lesson complete.
6. Try the subject filter.
7. Open Facilitator View.
8. Check resources that match the lesson.
9. Review teacher notes.
10. Export a pilot report if the facilitator needs a non-private summary.
11. Reset progress before a new group uses the same device.

## What To Observe

- Can learners understand what to click next?
- Can volunteers find Facilitator View?
- Are lesson words too hard or too easy?
- Does the app work without internet after it has loaded?
- Is any text confusing, unsafe, or culturally inappropriate?
- Does reset progress make sense for shared-device use?

## Known Limitations

- Progress is saved only in the current browser on the current device.
- Resetting progress deletes local completion data.
- Lesson content is sample content and needs local review.
- Language support is incomplete.
- Kiwix is explained as a future offline library connection, not fully integrated yet.
- External teacher resource links must be downloaded separately before offline use.
- The visual design is still a first version.

## Kiwix Pilot Idea

For a later supervised pilot, a teacher or volunteer could prepare a separate
Kiwix Reader or Kiwix Server library before the session. LearnBridge would stay
as the guided lesson app, and Kiwix would provide deeper reading material.

Start small:

1. Choose one device for Kiwix Reader.
2. Download one small ZIM file in a useful language or subject.
3. Let learners open LearnBridge lessons first.
4. Use Kiwix only when a lesson needs extra reading or pictures.
5. Do not ask children to search for sensitive personal, political, or conflict
   topics during group activities.

## Recommended Next Improvements

- Review and localize lessons with community educators.
- Add Burmese, Rakhine, and Thai translations.
- Add printable worksheets.
- Add audio support for early readers.
- Add a clearer offline install flow.
- Improve mobile and tablet layout.
