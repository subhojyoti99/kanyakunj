"use client";

export default function VideoPopupSection() {
  return (
    <section className="video-embed-section">
      <div className="video-embed-container">
        <div className="iframe-wrapper">
          <iframe
            src="https://player.vimeo.com/video/323242472?background=1&autoplay=1&loop=1&byline=0&title=0"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <style jsx>{`
        .video-embed-section {
          width: 100%;
          background: var(--ivory-dark);
          padding: 20px;
        }
        .video-embed-container {
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
        }
        .iframe-wrapper {
          position: relative;
          padding-bottom: 36%; /* 1920:810 aspect ratio approximately, or use 56.25 for 16:9 */
          height: 0;
          overflow: hidden;
        }
        .iframe-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        @media (max-width: 768px) {
          .iframe-wrapper {
            padding-bottom: 56.25%; /* 16:9 for mobile */
          }
        }
      `}</style>
    </section>
  );
}
