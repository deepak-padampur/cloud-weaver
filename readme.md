
### Blueprint of the orchestrator:

- **Orchestrator API:** This is the `front door`. Users or apps say: ‘Hey, I need a server to run this job.’

- **Scheduler:** This is the `decision-maker`. It chooses the best place to run the job — cheapest, fastest, or closest to the user.

- **Cloud Abstraction:** Think of these as `translators`. AWS, GCP, and Azure all speak different languages. We’ll build a layer that talks to all of them in one common language.

- **Heartbeat & Auto-Healing:** Just like you check if someone is breathing, a heartbeat system `checks if a server is alive`. If it’s not, we restart it or move the job somewhere else.

- **Event & Analytics Queue:** This `records` every action (start, stop, failure) so we can monitor, debug, and optimize our system.”

<img width="1601" height="711" alt="High Level Architecture- CloudWeaver" src="https://github.com/user-attachments/assets/f2854842-5b48-4880-b3d7-31940168d805" />

