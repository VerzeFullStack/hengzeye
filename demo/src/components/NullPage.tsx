import { Link } from "react-router-dom";

function NullPage() {
  return (
    <div>
      <h2>404 Not Found!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default NullPage