import React, { forwardRef } from "react"

const Title = forwardRef((props, ref) => {
    return (
        <h1 className='title' ref={ref} {...props}>Tic Tac Toe</h1>
    );
});

export default Title;

