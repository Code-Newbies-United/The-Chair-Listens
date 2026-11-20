// Shared prostate cancer awareness strip, copied from check-in.
// Styles are scoped to this component, so the parent page's CSS is unaffected.

function BlueCancerRibbon({ size = 42 }) {
    return (
        <svg
            width={size}
            height={size * 1.15}
            viewBox="0 0 42 48"
            role="img"
            aria-label="Blue prostate cancer awareness ribbon"
        >
            <path
                d="M12 5 C2 13 9 25 19 25 C29 25 36 13 26 5"
                fill="none"
                stroke="#2877B8"
                strokeWidth="7"
                strokeLinecap="round"
            />
            <path d="M12 23 L8 43 L19 35 L21 27" fill="#2877B8" />
            <path d="M27 23 L34 43 L22 35 L21 27" fill="#2877B8" />
        </svg>
    );
}

export default function AwarenessStrip() {
    return (
        <div className="aw-strip">
            <div className="aw-icon">
                <BlueCancerRibbon size={42} />
            </div>

            <div className="aw-content">
                <span className="aw-kicker">PROSTATE CANCER AWARENESS</span>

                <h2>A conversation could save a life.</h2>

                <p>
                    Prostate cancer can develop without noticeable symptoms in its
                    early stages. Knowing your risk and having conversations about
                    screening matters.
                </p>

                <a
                    href="https://cansa.org.za/prostate-cancer/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aw-link"
                >
                    Learn more about prostate cancer ➮
                </a>
            </div>

            <style jsx>{`
        .aw-strip {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding: 19px 21px;
          border: 1px solid rgba(40, 119, 184, 0.22);
          border-radius: 18px;
          background: #e7f1f7;
          color: #245b83;
          box-shadow: 0 8px 20px rgba(32, 63, 54, 0.06);
          text-align: left;
        }
        .aw-icon {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .aw-content {
          min-width: 0;
        }
        .aw-kicker {
          display: block;
          margin-bottom: 6px;
          color: #2877b8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }
        h2 {
          margin: 0 0 6px;
          color: #245b83;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.2;
        }
        p {
          margin: 0 0 9px;
          color: #496b80;
          font-size: 12px;
          line-height: 1.5;
        }
        .aw-link {
          display: inline-block;
          color: #17649a;
          font-size: 11px;
          font-weight: 800;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .aw-link:hover {
          color: #0c456d;
        }
        .aw-link:focus-visible {
          outline: 2px solid #2877b8;
          outline-offset: 4px;
          border-radius: 2px;
        }
        @media (max-width: 520px) {
          .aw-strip {
            gap: 11px;
            padding: 15px;
          }
          h2 {
            font-size: 14px;
          }
          p {
            font-size: 11px;
          }
        }
      `}</style>
        </div>
    );
}