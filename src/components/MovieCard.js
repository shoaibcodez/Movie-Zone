export const MovieCard = (props) => {
    const IMAGE_PATH = "https://image.tmdb.org/t/p/w500/"
    // console.log(props.movie)
    return (
        <div className="movie-card" onClick={() => props.selectMovie(props.movie)}>
            {props.movie.poster_path ? <img className="movie-cover" src={`${IMAGE_PATH}${props.movie.poster_path}`} alt="" />
                : <img className="movie-nocover" src="https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" alt="" />}
            <h5 className="movie-title">{props.movie.title}</h5>
        </div>
    );
}
 // "homepage": "https://shoaibcodez.github.io/Movie-Zone",