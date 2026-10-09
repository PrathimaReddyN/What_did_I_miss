export const SAMPLE_CONVERSATION = `[10:02 AM] Prof. Martinez: Good morning everyone. Reminder: Midterm exam is on October 15th at 2 PM in Hall B. Bring your student ID and a calculator.

[10:05 AM] Sarah: Hi professor, will the exam cover chapters 1-5 or 1-6?

[10:07 AM] Prof. Martinez: Chapters 1 through 5 only. Chapter 6 will be on the final.

[10:10 AM] Mike: The group project is due October 20th right? Just confirming.

[10:11 AM] Prof. Martinez: Correct. October 20th, 11:59 PM submission via the portal. No late submissions accepted.

[10:15 AM] Jessica: I won't be able to make it to class next Tuesday. I have a doctor's appointment. Can someone share notes?

[10:16 AM] David: I'll share my notes with you Jessica, no worries.

[10:20 AM] Sarah: Everyone remember the study group session Thursday at 6 PM in the library, room 204.

[10:22 AM] Mike: Is that confirmed or just proposed?

[10:23 AM] Sarah: It's confirmed. I booked the room already.

[10:30 AM] Prof. Martinez: Also, office hours are moved to Wednesday 3-5 PM this week only, instead of the usual Monday slot.

[10:35 AM] David: Has anyone started on the research paper? It's due November 1st and I'm a bit lost on the topic.

[10:37 AM] Jessica: I started yesterday. Let's work on it together after the study group Thursday.

[10:40 AM] Mike: Sounds good. We can meet at the library after the study session.

[10:45 AM] Prof. Martinez: One more thing - the quiz originally scheduled for this Friday has been CANCELLED. It will be rescheduled for next week. I'll confirm the date soon.

[10:50 AM] Sarah: Also guys, if you haven't filled out the course feedback survey yet, please do it by this Sunday. It's important for the department.

[10:55 AM] David: Where do we find the survey link?

[10:56 AM] Sarah: It's on the course portal under "Surveys".`;

import type { AnalysisResult } from '@/types';

export const DEMO_RESULT: AnalysisResult = {
  summary: [
    "Professor Martinez confirmed the midterm exam covers chapters 1-5, scheduled for October 15th at 2 PM in Hall B.",
    "The group project is due October 20th at 11:59 PM via the portal with no late submissions accepted.",
    "A study group session is confirmed for Thursday at 6 PM in library room 204.",
    "Office hours have been moved to Wednesday 3-5 PM this week only.",
    "The Friday quiz has been cancelled and will be rescheduled for next week, date to be confirmed.",
    "Jessica needs class notes for next Tuesday and David volunteered to share his.",
    "The course feedback survey must be completed by this Sunday via the course portal.",
  ],
  important_messages: [
    {
      speaker: "Prof. Martinez",
      message: "Midterm exam on October 15th at 2 PM in Hall B. Covers chapters 1-5 only. Bring student ID and calculator.",
      category: "Exam Announcement",
      priority: "high",
      source_excerpt: "Midterm exam is on October 15th at 2 PM in Hall B. Bring your student ID and a calculator.",
    },
    {
      speaker: "Prof. Martinez",
      message: "Group project due October 20th, 11:59 PM via portal. No late submissions accepted.",
      category: "Deadline Announcement",
      priority: "high",
      source_excerpt: "October 20th, 11:59 PM submission via the portal. No late submissions accepted.",
    },
    {
      speaker: "Prof. Martinez",
      message: "Friday quiz has been CANCELLED and will be rescheduled for next week. Date to be confirmed.",
      category: "Cancellation",
      priority: "high",
      source_excerpt: "the quiz originally scheduled for this Friday has been CANCELLED. It will be rescheduled for next week.",
    },
    {
      speaker: "Prof. Martinez",
      message: "Office hours moved to Wednesday 3-5 PM this week only, replacing the usual Monday slot.",
      category: "Schedule Change",
      priority: "medium",
      source_excerpt: "office hours are moved to Wednesday 3-5 PM this week only, instead of the usual Monday slot.",
    },
    {
      speaker: "Sarah",
      message: "Course feedback survey must be completed by this Sunday. Available on the course portal under 'Surveys'.",
      category: "Request for Action",
      priority: "medium",
      source_excerpt: "if you haven't filled out the course feedback survey yet, please do it by this Sunday.",
    },
  ],
  deadlines: [
    {
      description: "Midterm Exam (Chapters 1-5)",
      date: "October 15",
      time: "2:00 PM",
      is_confirmed: true,
      is_ambiguous: false,
      context: "In Hall B. Bring student ID and calculator.",
      speaker: "Prof. Martinez",
    },
    {
      description: "Group Project Submission",
      date: "October 20",
      time: "11:59 PM",
      is_confirmed: true,
      is_ambiguous: false,
      context: "Submit via portal. No late submissions accepted.",
      speaker: "Prof. Martinez",
    },
    {
      description: "Study Group Session",
      date: "October 12 (Thursday)",
      time: "6:00 PM",
      is_confirmed: true,
      is_ambiguous: false,
      context: "Library room 204. Room booked by Sarah.",
      speaker: "Sarah",
    },
    {
      description: "Course Feedback Survey Deadline",
      date: "This Sunday",
      time: null,
      is_confirmed: true,
      is_ambiguous: true,
      context: "Available on course portal under 'Surveys'. Exact date not specified - needs confirmation.",
      speaker: "Sarah",
    },
    {
      description: "Research Paper Due",
      date: "November 1",
      time: null,
      is_confirmed: true,
      is_ambiguous: false,
      context: "David and Jessica plan to work on it together after the Thursday study group.",
      speaker: "David",
    },
    {
      description: "Rescheduled Quiz (next week)",
      date: null,
      time: null,
      is_confirmed: false,
      is_ambiguous: true,
      context: "Originally scheduled for this Friday but cancelled. Professor will confirm the new date. Needs confirmation.",
      speaker: "Prof. Martinez",
    },
  ],
  action_items: [
    {
      id: "ai-1",
      task: "Study for midterm exam (chapters 1-5)",
      speaker: null,
      completed: false,
    },
    {
      id: "ai-2",
      task: "Submit group project via portal",
      speaker: null,
      completed: false,
    },
    {
      id: "ai-3",
      task: "Share class notes with Jessica for next Tuesday",
      speaker: "David",
      completed: false,
    },
    {
      id: "ai-4",
      task: "Attend study group Thursday at 6 PM, library room 204",
      speaker: null,
      completed: false,
    },
    {
      id: "ai-5",
      task: "Fill out course feedback survey on the portal by Sunday",
      speaker: null,
      completed: false,
    },
    {
      id: "ai-6",
      task: "Work on research paper with Jessica after study group",
      speaker: "David",
      completed: false,
    },
  ],
  decisions: [
    {
      decision: "Midterm will cover chapters 1-5 only; chapter 6 deferred to the final exam.",
      speaker: "Prof. Martinez",
      context: "Sarah asked about the scope; professor clarified the exam range.",
    },
    {
      decision: "Study group session is confirmed for Thursday at 6 PM in library room 204.",
      speaker: "Sarah",
      context: "Mike asked if it was confirmed; Sarah confirmed she had already booked the room.",
    },
    {
      decision: "David will share his class notes with Jessica for next Tuesday's missed class.",
      speaker: "David",
      context: "Jessica mentioned she would miss class due to a doctor's appointment.",
    },
    {
      decision: "Jessica and David agreed to collaborate on the research paper after the Thursday study session.",
      speaker: "Jessica",
      context: "David expressed feeling lost on the topic; Jessica suggested working together.",
    },
  ],
  must_not_miss: [
    {
      text: "Midterm exam on October 15th at 2 PM in Hall B (chapters 1-5, bring ID and calculator)",
      reason: "High-stakes graded exam happening soon with specific requirements.",
    },
    {
      text: "Group project due October 20th at 11:59 PM - no late submissions",
      reason: "Hard deadline with no extensions. Failing to submit means a zero.",
    },
    {
      text: "Friday quiz has been CANCELLED - do not study for it this week",
      reason: "Cancellation means students should redirect study time to the midterm instead.",
    },
    {
      text: "Office hours moved to Wednesday 3-5 PM this week only",
      reason: "One-time schedule change. Anyone showing up Monday will miss it.",
    },
    {
      text: "Course feedback survey due this Sunday on the portal",
      reason: "Time-sensitive request from a peer with departmental importance.",
    },
  ],
  questions: [
    {
      question: "Will the exam cover chapters 1-5 or 1-6?",
      speaker: "Sarah",
      directed_at: "Prof. Martinez",
      is_answered: true,
      answer: "Chapters 1 through 5 only. Chapter 6 will be on the final.",
      answer_speaker: "Prof. Martinez",
      source_excerpt: "Hi professor, will the exam cover chapters 1-5 or 1-6?",
    },
    {
      question: "The group project is due October 20th right? Just confirming.",
      speaker: "Mike",
      directed_at: "Prof. Martinez",
      is_answered: true,
      answer: "Correct. October 20th, 11:59 PM submission via the portal. No late submissions accepted.",
      answer_speaker: "Prof. Martinez",
      source_excerpt: "The group project is due October 20th right? Just confirming.",
    },
    {
      question: "Can someone share notes for next Tuesday's class?",
      speaker: "Jessica",
      directed_at: null,
      is_answered: true,
      answer: "I'll share my notes with you Jessica, no worries.",
      answer_speaker: "David",
      source_excerpt: "Can someone share notes?",
    },
    {
      question: "Is the study group confirmed or just proposed?",
      speaker: "Mike",
      directed_at: "Sarah",
      is_answered: true,
      answer: "It's confirmed. I booked the room already.",
      answer_speaker: "Sarah",
      source_excerpt: "Is that confirmed or just proposed?",
    },
    {
      question: "Has anyone started on the research paper?",
      speaker: "David",
      directed_at: null,
      is_answered: true,
      answer: "I started yesterday. Let's work on it together after the study group Thursday.",
      answer_speaker: "Jessica",
      source_excerpt: "Has anyone started on the research paper? It's due November 1st and I'm a bit lost on the topic.",
    },
    {
      question: "Where do we find the survey link?",
      speaker: "David",
      directed_at: "Sarah",
      is_answered: true,
      answer: "It's on the course portal under \"Surveys\".",
      answer_speaker: "Sarah",
      source_excerpt: "Where do we find the survey link?",
    },
  ],
  cancellations: [
    {
      type: "cancellation",
      description: "Friday quiz has been cancelled",
      what_changed: "The quiz scheduled for this Friday is cancelled and will be rescheduled for next week.",
      original: "Quiz originally scheduled for this Friday",
      speaker: "Prof. Martinez",
      source_excerpt: "the quiz originally scheduled for this Friday has been CANCELLED. It will be rescheduled for next week.",
    },
    {
      type: "change",
      description: "Office hours moved to Wednesday",
      what_changed: "Office hours moved from Monday to Wednesday 3-5 PM this week only.",
      original: "Usual Monday office hours slot",
      speaker: "Prof. Martinez",
      source_excerpt: "office hours are moved to Wednesday 3-5 PM this week only, instead of the usual Monday slot.",
    },
  ],
  is_demo: true,
};
