export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{display:'grid', gap:'0.5rem'}}>
        <strong>Kemmstudio Production</strong>
        <span>Kuria Entertainment Music and Movie Studio</span>
        <span>Music production • Video production • Film production • Videography • Photography</span>
        <span className="muted">© {new Date().getFullYear()} Kemmstudio Production. All rights reserved.</span>
      </div>
    </footer>
  );
}
