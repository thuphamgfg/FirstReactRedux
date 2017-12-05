class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.setState(prevState => ({
    words: prevState.words.concat(['marklar'])
  }));
  }

  /*handleClick() {
    // This section is bad style and causes a bug
    const words = [...this.state.words];
    words.push('marklar');
    this.setState({words: words});
  }*/
  
  /*handleClick() {
  this.setState(prevState => ({
    words: [...prevState.words, 'marklar'],
  }))
  }*/

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}

ReactDOM.render(
  <WordAdder />,
  document.getElementById('root')
);

let arr1 = [1,2,3];
let arr2 = arr1.concat(4);
console.log(arr2);
