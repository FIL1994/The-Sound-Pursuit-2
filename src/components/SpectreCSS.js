/** @license GPL-3.0
 * SpectreCSS.js
 *
 * @author: Philip Van Raalte
 * @date November 8, 2017
 *
 * Functional components for the Spectre CSS library.
 */
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

/**
 * Prepends the className from props to the component default className.
 * @param {String} defaultClass The default class for the component.
 * @param {String} newClass The class name to prepend to the default class. (So the default class will override it)
 * @returns {String} JSX Component
 */
function addClass(defaultClass, newClass) {
  return `${defaultClass} ${_.isString(newClass) ? newClass : ""}`.trim();
}

/**
 * A simple button.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
let Button = props => {
  const {
    small,
    large,
    block,
    primary,
    centered,
    disabled,
    success,
    error,
    loading,
    link,
    inputGroup
  } = props;
  let className = "btn";
  let otherProps = {};

  // allow size to be passed as a string or a number
  if (!_.isEmpty(props.size) || _.isNumber(props.size)) {
    className = `${className} col-${props.size.toString().trim()}`;
  }

  if (large) {
    className = addClass(className, "btn-lg");
  } else if (small) {
    className = addClass(className, "btn-sm");
  }

  if (block) {
    className = addClass(className, "btn-block");
  }

  if (primary) {
    className = addClass(className, "btn-primary");
  }

  if (success) {
    className = addClass(className, "btn-success");
  }

  if (error) {
    className = addClass(className, "btn-error");
  }

  if (link) {
    className = addClass(className, "btn-link");
  }

  if (loading) {
    className = addClass(className, "loading");
  }

  if (centered) {
    className = addClass(className, "centered text-center");
  }

  if (inputGroup) {
    className = addClass(className, "input-group-btn");
  }

  if (disabled) {
    otherProps.disabled = true;
    otherProps.tabIndex = "-1";
    className = addClass(className, "disabled");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, [
    "small",
    "large",
    "block",
    "primary",
    "centered",
    "disabled",
    "as",
    "success",
    "error",
    "loading",
    "link",
    "inputGroup"
  ]);

  return <props.as {...myProps} {...otherProps} className={className} />;
};

Button.defaultProps = {
  as: props => <button type="button" {...props} /> // type defaults to "button" if no component is provided in props
};

Button.Group = props => {
  const { block } = props;
  let className = "btn-group";

  if (block) {
    className = addClass(className, "btn-group-block");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ["block"]);

  return <div {...myProps} className={className} />;
};

export { Button };

/**
 * A divider for separating elements.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Divider = props => {
  // add the className prop to the className
  let className = addClass("divider", props.className);

  // allow size to be passed as a string or a number
  if (!_.isEmpty(props.size) || _.isNumber(props.size)) {
    className = addClass(
      className,
      `col-${props.size.toString().trim()} centered`
    );
  }

  return <div {...props} className={className} />;
};

/**
 * A loading indicator.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Loading = props => {
  const { large } = props;
  let className = "loading";

  if (large) {
    className = addClass(className, "loading-lg");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ["large"]);

  return <div {...myProps} className={className} />;
};

/**
 * A page for containing elements.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Page = props => {
  const { centered } = props;
  // add the className prop to the className
  let className = addClass("page container", props.className);

  if (centered) {
    className = addClass(className, "centered text-center");
  }

  // remove unnecessary props
  let myProps = _.omit(props, ["centered"]);

  return <div {...myProps} className={className} />;
};

/**
 * A table for a data set
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
const Table = props => {
  const { striped, hover, centered } = props;
  // add the className prop to the className
  let className = addClass("table", props.className);

  if (striped) {
    className = addClass(className, "table-striped");
  }

  if (hover) {
    className = addClass(className, "table-hover");
  }

  if (centered) {
    className = addClass(className, "text-center");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ["striped", "hover", "centered"]);

  return <table {...myProps} className={className} />;
};

Table.Head = props => {
  const { headings, headingProps, onHeadingClick } = props;

  // remove unnecessary props
  let myProps = _.omit(props, ["headings", "headingProps", "onHeadingClick"]);

  return (
    <thead {...myProps}>
      <tr {...headingProps}>
        {headings.map(
          (h, index) =>
            _.isArray(h) ? (
              <th key={h[1]} onClick={() => onHeadingClick(h[1])}>
                {h[0]}
              </th>
            ) : (
              <th
                key={`heading-${h}-${index}`}
                onClick={() => onHeadingClick(h)}
              >
                {h}
              </th>
            )
        )}
      </tr>
    </thead>
  );
};

Table.Head.propTypes = {
  headings: PropTypes.array.isRequired,
  onHeadingClick: PropTypes.func
};

Table.Head.defaultProps = {
  onHeadingClick: _.noop
};

Table.Body = props => {
  return <tbody {...props} />;
};

Table.Row = props => {
  return <tr {...props} />;
};

export { Table };

/**
 * A tab for switching between views
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
const Tab = props => {
  const { block } = props;
  // add the className prop to the className
  let className = addClass("tab", props.className);

  if (block) {
    className = addClass(className, "tab-block");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ["block"]);

  return <ul {...myProps} className={className} />;
};

Tab.Heading = props => {
  const { active } = props;
  // add the className prop to the className
  let className = addClass("tab-item", props.className);

  if (active) {
    className = addClass(className, "active");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ["active"]);

  return <li {...myProps} className={className} />;
};

export { Tab };

/**
 * A toast to show an alert or information.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Toast = props => {
  const { primary, centered } = props;
  // add the className prop to the className
  let className = addClass("toast", props.className);

  if (primary) {
    className = addClass(className, "btn-primary");
  }

  if (centered) {
    className = addClass(className, "centered text-center");
  }

  // remove unnecessary props
  let myProps = _.omit(props, ["primary", "centered"]);

  return <div {...myProps} className={className} />;
};

/**
 * A hover parallax effect.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Parallax = props => {
  const { children, title, topLeft, topRight, bottomLeft, bottomRight } = props;

  // add the className prop to the className
  let className = addClass("parallax", props.className);

  // remove unnecessary props
  let myProps = _.omit(props, [
    "children",
    "title",
    "topLeft",
    "topRight",
    "bottomLeft",
    "bottomRight"
  ]);

  return (
    <div {...myProps} className={className}>
      <div className="parallax-top-left" onClick={topLeft} />
      <div className="parallax-top-right" onClick={topRight} />
      <div className="parallax-bottom-left" onClick={bottomLeft} />
      <div className="parallax-bottom-right" onClick={bottomRight} />
      <div className="parallax-content">
        <div className="parallax-front">
          <h2>{title}</h2>
        </div>
        <div className="parallax-back">{children}</div>
      </div>
    </div>
  );
};

/**
 * A flexible view container with an auto-expand content section.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Panel = props => {
  const { children, title, footer } = props;

  // add the className prop to the className
  let className = addClass("panel", props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ["children", "title", "footer"]);

  let header = _.isEmpty(title) ? (
    <Fragment />
  ) : (
    <div className="panel-header">
      <div className="panel-title">
        <h5>{title}</h5>
      </div>
    </div>
  );

  return (
    <div {...myProps} className={className}>
      {header}
      <div className="panel-body">{children}</div>
      <div className="panel-footer">{footer}</div>
    </div>
  );
};

/**
 * A placeholder for first time use, empty data and error screens.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const EmptyState = props => {
  const { children, title, icon } = props;

  // add the className prop to the className
  let className = addClass("empty", props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ["children", "title", "icon"]);

  return (
    <div {...myProps} className={className}>
      {_.isEmpty(icon) ? "" : <div className="empty-icon">{icon}</div>}
      <div className="empty-title h5">{title}</div>
      <div className="empty-action">{children}</div>
    </div>
  );
};

/**
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
const Pagination = props => {
  const { activePage, totalPages, centered } = props;

  // add the className prop to the className
  let className = addClass("pagination", props.className);

  // remove unnecessary props
  let myProps = _.omit(props, [
    "children",
    "onClick",
    "activePage",
    "totalPages",
    "centered"
  ]);

  const pages = Array.from(new Array(_.ceil(totalPages)), () => undefined);

  const prevEnabled = !(activePage <= 1);
  const nextEnabled = !(activePage >= totalPages);
  const disabledTab = { tabIndex: "-1" };

  return (
    <ul
      style={centered ? { justifyContent: "center" } : {}}
      {...myProps}
      className={className}
    >
      <li
        onClick={!prevEnabled ? _.noop : e => props.onClick(e, activePage - 1)}
        className={`page-item ${prevEnabled ? "" : "disabled"}`}
      >
        <a style={{ cursor: "pointer" }} {...(prevEnabled ? {} : disabledTab)}>
          {"<"}
        </a>
      </li>
      {pages.map((i, index) => (
        <li
          key={index}
          className={`page-item ${index + 1 === activePage ? "active" : ""}`}
          onClick={e => props.onClick(e, index + 1)}
        >
          <a style={{ cursor: "pointer" }}>{index + 1}</a>
        </li>
      ))}
      <li
        onClick={!nextEnabled ? _.noop : e => props.onClick(e, activePage + 1)}
        className={`page-item ${nextEnabled ? "" : "disabled"}`}
      >
        <a style={{ cursor: "pointer" }} {...(nextEnabled ? {} : disabledTab)}>
          {">"}
        </a>
      </li>
    </ul>
  );
};

Pagination.propTypes = {
  onClick: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired
};

Pagination.defaultProps = {
  activePage: 1
};

export { Pagination };

const Grid = props => {
  const { gapless } = props;
  let className = addClass("columns", props.className);

  if (gapless) {
    className = addClass(className, "col-gapless");
  }

  let myProps = _.omit(props, ["gapless"]);

  return <div {...myProps} className={className} />;
};

Grid.defaultProps = {
  gapless: false
};

Grid.propTypes = {
  gapless: PropTypes.bool
};

Grid.Column = props => {
  const { width } = props;
  let className = addClass(`column col-${width}`, props.className);

  let myProps = _.omit(props, ["width"]);

  return <div {...myProps} className={className} />;
};

Grid.Column.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export { Grid };

class ControlledTab extends Component {
  state = {
    active:
      this.props.defaultActive ||
      (this.props.options[0] && this.props.options[0].value)
  };

  renderActive = () => {
    const activeOption = this.props.options.find(
      o => this.state.active === o.value
    );

    return activeOption ? activeOption.render() : <Fragment />;
  };

  render() {
    return (
      <Fragment>
        <Tab block>
          {this.props.options.map(({ label, value }) => {
            return (
              <Fragment key={value}>
                <Tab.Heading
                  active={this.state.active === value}
                  onClick={() => {
                    this.setState({ active: value });
                  }}
                  children={<a>{label}</a>}
                />
              </Fragment>
            );
          })}
        </Tab>
        <div style={{ marginTop: 10 }}>{this.renderActive()}</div>
      </Fragment>
    );
  }
}
ControlledTab.defaultProps = {
  defaultActive: undefined
};

ControlledTab.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.stringisRequired,
      render: PropTypes.nodeisRequired
    })
  ),
  defaultActive: PropTypes.string
};

export { ControlledTab };
