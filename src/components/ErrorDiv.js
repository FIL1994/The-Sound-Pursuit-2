/**
 * @author Philip Van Raalte
 * @date 2017-12-26
 */
import React from 'react';

export default (props) => {
  return (
    <div {...props} className={`form-input-hint is-error text-center ${props.className || ''}`}/>
  )
};