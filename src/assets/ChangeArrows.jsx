export default function ChangeArrows({ onClick }) {
    return (
        <svg
            onClick={onClick}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ cursor: 'pointer', marginBottom: '10px' }}
        >
            <path fill="currentColor" d="M7 7V4l-5 5l5 5V9h10V7H7Zm10 10v3l5-5l-5-5v3H7v2h10Z" />
        </svg>
    );
}