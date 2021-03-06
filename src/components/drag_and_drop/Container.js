/**
 * @author Philip Van Raalte
 * @date 2017-12-15
 */
import React, { Component } from "react";
import update from "immutability-helper";
import Card from "./Card";
import { DropTarget } from "react-dnd";
import ItemTypes from "./ItemTypes";
import _ from "lodash";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: props.list
    };

    this.pushCard = this.pushCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.moveCard = this.moveCard.bind(this);
  }

  getCards() {
    return this.state.cards;
  }

  pushCard(card) {
    this.setState(
      update(this.state, {
        cards: {
          $push: [card]
        }
      })
    );
  }

  removeCard(index) {
    this.setState(
      update(this.state, {
        cards: {
          $splice: [[index, 1]]
        }
      })
    );
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    );
  }

  render() {
    const { cards } = this.state;
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isHoveringOnMaxItems = isOver && !canDrop;
    const isActive = canDrop && isOver;
    const style = {
      minHeight: "200px",
      border: "1px solid gray"
    };

    const backgroundColor = isActive ? "#29887f" : "#FFF";

    return connectDropTarget(
      <div
        style={{ ...style, backgroundColor }}
        className={`${this.props.classes} drag-container`}
      >
        {isHoveringOnMaxItems && (
          <div
            style={{
              color: "white",
              backgroundColor: "#e83600",
              fontWeight: "bold",
              position: "relative",
              padding: "3px 0px",
              background: "linear-gradient(131deg, #971212, #b80707)"
            }}
          >
            Max Songs Reached
          </div>
        )}
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            listId={this.props.id}
            card={card}
            removeCard={this.removeCard}
            moveCard={this.moveCard}
            canDrag={true}
          />
        ))}
      </div>
    );
  }
}

const cardTarget = {
  /* Analyses if the container's id is different from the container's id of the object being dropped.
   * If positive then push the element. don't need to push elements when the containers are the same
   */
  drop(props, monitor, component) {
    const { id } = props;
    const sourceObj = monitor.getItem();
    if (id !== sourceObj.listId) {
      component.pushCard(sourceObj.card);
    }
    return {
      listId: id
    };
  },
  canDrop(props, monitor) {
    const cards = props.getCards();

    if (!_.isArray(cards)) {
      return false;
    }

    return Boolean(cards.length < props.maxSongs);
  }
};

export default DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(Container);
