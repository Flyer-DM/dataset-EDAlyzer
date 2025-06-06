import '../styles/Header.css';

export default function Header() {

  return (
    <header className="header">
      <div className='header-left'>
        <h1 className="header-title">Dataset EDAlyzer</h1>
      </div>
      <div className='header-right'>
        <a className='github-link' href='https://github.com/Flyer-DM'>GitHub</a>
      </div>
    </header>
  );
}
