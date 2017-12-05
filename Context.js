<script src="https://unpkg.com/prop-types/prop-types.js"></script>
<div id="root">
  <!-- This div's content will be managed by React. -->
</div>

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
         <Button>{this.props.text}</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message key = {message.id} text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
ReactDOM.render(<MessageList messages={[{id: 1,text : 'test'}]}/>, document.getElementById('root'));