import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function MovieDetail() {
  const { id } = useParams();
 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching movie id:", id);

    fetch(`https://fooapi.com/api/movies/${id}`)
      .then((res) => res.json())
      .then((response) => {
        console.log("Movie detail API:", response);

        if (response?.data?.id) {
          setMovie(response?.data);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log("Error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <h2>Loading...</h2>;

  if (!movie || !movie.id) return <h2>Movie not found</h2>;

  return (
    <div>
      <h1>{movie.title}</h1>

      <img
        src={movie.poster}
        alt={movie.title}
      />

      <p>Awards: {movie.awards}</p>

         <p>Rating: {movie.imdbRating}</p>
      <p>Released: {movie.released}</p>

      <Link to="/">Back Home</Link>
    </div>
  );
}

export default MovieDetail;