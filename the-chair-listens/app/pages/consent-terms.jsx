// Destination: pages/consent-terms.jsx
import Link from "next/link";

/**
 * The Chair Listens - Participant Consent & Privacy Notice
 * Route: /consent-terms
 */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    background: "#FFFFFF",
    fontFamily: "'IBM Plex Sans', sans-serif",
    padding: "48px 20px 72px",
    boxSizing: "border-box",
  },
  frame: {
    width: "100%",
    maxWidth: "620px",
  },
  back: {
    display: "inline-block",
    fontSize: "14px",
    marginBottom: "32px",
  },
  h1: {
    fontFamily: "'IBM Plex Serif', serif",
    fontWeight: 700,
    fontSize: "26px",
    color: "#111111",
    margin: "0 0 12px 0",
    letterSpacing: "-0.01em",
  },
  meta: {
    fontSize: "13px",
    color: "#444444",
    margin: "0 0 4px 0",
  },
  rule: {
    border: "none",
    borderTop: "1px solid #111111",
    margin: "24px 0 8px 0",
  },
  section: {
    marginTop: "28px",
    marginBottom: "8px",
  },
  h2: {
    fontFamily: "'IBM Plex Serif', serif",
    fontWeight: 600,
    fontSize: "17px",
    color: "#111111",
    margin: "0 0 10px 0",
  },
  body: {
    fontFamily: "'IBM Plex Serif', serif",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#222222",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    lineHeight: 1.7,
  },
  contactList: {
    margin: 0,
    lineHeight: 1.9,
    listStyle: "none",
    paddingLeft: 0,
  },
};

export default function ConsentTerms() {
  return (
      <main style={styles.page}>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        .clisten-back { color: #111111; text-decoration: underline; }
        .clisten-back:hover { color: #555555; }
      `}</style>

        <div style={styles.frame}>
          <Link href="/" style={styles.back} className="clisten-back">
            ⮜ Back to the chair
          </Link>

          <h1 style={styles.h1}>Participant Consent &amp; Privacy Notice</h1>
          <p style={styles.meta}>
            Campaign Activation: The Chair Listens &ndash; Men's Health
            Awareness Initiative
          </p>
          <p style={styles.meta}>
            Governing Law: Protection of Personal Information Act 4 of 2013
            (POPIA), Republic of South Africa
          </p>

          <hr style={styles.rule} />

          <Section num="1" title="Purpose of Collection">
            By sitting in The Blue Chair and participating in this
            activation, you are voluntarily contributing to a
            public-interest digital archive aimed at raising awareness
            around men's mental health, prostate health, and emotional
            well-being across South Africa.
          </Section>

          <Section num="2" title="Anonymity & Protection of Personal Information (POPIA)">
            <p style={{ margin: "0 0 10px 0" }}>
              To ensure your privacy and strictly comply with POPIA
              regulations:
            </p>
            <ul style={styles.list}>
              <li>
                <strong>Zero PII Collection:</strong> We do not request,
                collect, or store any Personal Identifiable Information (PII)
                such as full names, ID numbers, phone numbers, email
                addresses, or residential details.
              </li>
              <li>
                <strong>Location Tagging:</strong> Submissions are linked
                solely to an anonymized location code (e.g., "Durban Golf
                Day") to generate regional campaign statistics.
              </li>
              <li>
                <strong>Voice Media &amp; Biometrics:</strong> Audio responses
                are processed securely on cloud infrastructure without
                association to your personal identity.
              </li>
              <li>
                <strong>Automated Data Stripping:</strong> Any names, phone
                numbers, or identifying details mentioned in text or voice
                responses are automatically redacted or removed prior to
                public archiving.
              </li>
              <li>
                <strong>AI-Generated Reflections:</strong> Your response is
                sent to a third-party AI service (Groq, running Meta's
                Llama model) to generate a short reflective reply after
                each question, and one overall reflection at the end of
                your session. This content is generated automatically and
                is not read or written by a person in real time. The AI
                service receives the text of your response in order to
                generate this reflection, but does not receive your name
                or contact details.
              </li>
            </ul>
          </Section>

          <Section num="3" title="Voluntary Participation & Finality of Submission">
            Participation is 100% voluntary. You may stop recording, exit
            the browser screen, or leave the chair at any time without
            consequence. Because all submissions are strictly anonymous and
            contain zero PII, it is technically impossible for administrators
            to identify, locate, or delete an individual's specific response
            after it has been submitted. Once a response is finalized and
            archived, withdrawal or individual retraction from the app is not
            possible.
          </Section>

          <Section num="4" title="Intellectual Property & Media Grant">
            By submitting your response, you grant The Chair Listens a
            non-exclusive, royalty-free, perpetual, worldwide license to
            use, reproduce, edit, publish, display, and distribute your
            anonymized response in campaign archives, social media
            platforms, research summaries, and educational broadcasts. You
            waive any claim to monetary compensation or royalties.
          </Section>

          <Section num="5" title="Non-Clinical Disclaimer & Crisis Support">
            {/*
            TODO: Confirm these helpline numbers directly against SADAG's
            current published listings before launch. Accuracy here matters
            more than anywhere else on this page.
          */}
            <p style={{ margin: "0 0 14px 0" }}>
              This installation provides health reflection and
              awareness&mdash;it does not offer medical diagnoses or
              therapy. If you or a loved one require immediate mental
              health or crisis support, please reach out to:
            </p>
            <ul style={styles.contactList}>
              <li>
                <strong>SADAG (SA Depression &amp; Anxiety Group):</strong>{" "}
                0800 567 567 (24/7 Helpline)
              </li>
              <li>
                <strong>Suicide Crisis Helpline:</strong> 0800 21 22 23
              </li>
              <li>
                <strong>National Health Helpline:</strong> 0800 029 999
              </li>
            </ul>
          </Section>
        </div>
      </main>
  );
}

function Section({ num, title, children }) {
  return (
      <section style={styles.section}>
        <h2 style={styles.h2}>
          {num}. {title}
        </h2>
        <div style={styles.body}>{children}</div>
      </section>
  );
}