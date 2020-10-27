import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import movieList from './movies-master.json';
import './style.scss';

const getMovieDetails = id => {
  return movieList.find(movie => movie.imdbID === id)
}

class MovieCard extends React.Component {
  render() {

    const movieDetails = getMovieDetails(this.props.id);

    return (
      <>
        <img loading="lazy" alt={movieDetails.title} src={`https://raw.githubusercontent.com/hjorturlarsen/IMDB-top-100/master/data/images/${movieDetails.imdbID}.jpg`} />
        <Title tag="h4" text={`${movieDetails.title}`} />
      </>
    )
  }
}

class Title extends React.Component {
  render() {
    const Tag = (this.props.tag === undefined) ? "h1" : this.props.tag;
    return (
    <Tag>{this.props.text}<small>{this.props.subText}</small></Tag>
    )
  }
}

class DetailsPage extends React.Component {
  render() {

    const movieDetails = getMovieDetails(this.props.match.params.movieId);

    return (
      <>
        <img loading="lazy" className="backsplash" alt={movieDetails.title} src={`https://raw.githubusercontent.com/hjorturlarsen/IMDB-top-100/master/data/images/${movieDetails.imdbID}.jpg`} />
        <div className="container">
          <Title tag="h1" text={movieDetails.title} />
          <div className="row">
            <div className="col-md-auto">
              <img alt={movieDetails.title} src={`https://raw.githubusercontent.com/hjorturlarsen/IMDB-top-100/master/data/images/${movieDetails.imdbID}.jpg`} />
            </div>
            <div className="col-md">
              {movieDetails.plot}
            </div>
          </div>
        </div>
      </>
    )
  }
}



class Search extends React.Component {
  constructor(props) {
    super();
    this.state = {
      value: ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    }, () => this.props.doCall(this.state.value));
  }

  render() {
    return (
      <div className="form-group">
        <input type="text" className="form-control" value={this.state.value} onChange={this.handleChange} placeholder="Search name" />
      </div>
    )
  }

}

class MainPage extends React.Component {
  constructor(props) {
    super();
    this.state = {
      filteredData: [],
    }

    this.dataStart = 0;
    this.dataEnd = 6;
    this.subText = '';
  }

  getData(mod) {
    const shiftAmount = (mod === undefined) ? 0 : mod;
    this.dataStart = this.dataStart + shiftAmount;
    this.dataEnd = this.dataEnd + shiftAmount;
    if (this.dataStart < 0 || this.dataEnd > 99) { return false };
    this.subText = ` (${this.dataStart + 1} to ${this.dataEnd})`;
    const newData = movieList.slice(this.dataStart, this.dataEnd);
    this.setData(newData);
  }

  searchData(term) {
    if (term.length < 2) {
      this.getData();
      return false;
    }
    this.subText = ` ('${term}')`;
    const newData = movieList.filter(movie => movie.title.toLowerCase().includes(term.toLowerCase()))
    this.setData(newData);
  }

  setData(data) {
    this.setState({ filteredData: data });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <>
        <div className="container">

          <div className="row justify-content-between align-items-center">
            <div className="col-auto">
              <button onClick={() => this.getData(-1)} className="btn btn-primary">&lt;</button>
            </div>
            <div className="col-auto">
              <Title tag="h1" text={`IMDB: Top 100`} subText={this.subText} />
            </div>
            <div className="col-auto">
              <button onClick={() => this.getData(1)} className="btn btn-primary">&gt;</button>
            </div>
          </div>

          <Search doCall={(term) => this.searchData(term)} />

          <small>{`${this.state.filteredData.length} result${(this.state.filteredData.length !== 1) ? 's' : ''} found`}</small>

          <div className="row">
            {
              this.state.filteredData.map(movie =>
                <div className="col-sm-6 col-md-4 col-lg-2" key={movie.imdbID}>
                  <Link to={`/movie/${movie.imdbID}`}>
                    <MovieCard id={movie.imdbID} />
                  </Link>
                </div>
              )
            }
          </div>

        </div>
      </>
    )
  }
}


class MasterPage extends React.Component {
  render() {
    return (
      <>
        <link href="" rel="stylesheet"></link>

        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/movie/:movieId" component={DetailsPage} />
        </Switch>
      </>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <MasterPage />
    )
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);