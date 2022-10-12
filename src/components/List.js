import React, { useRef, useEffect } from 'react';

const MyList = ({callback, children}) => {
    const listInnerRef = useRef();

    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            if (scrollTop + clientHeight === scrollHeight) {
                callback(true);
            } else {
                callback(false);
            }
        }
    };

    return (
        <div className="list" style={{width: '100%'}}>
            <div className="list-inner" style={{
                overflowY: 'auto',
                maxHeight: '75vh',
                minHeight: '300px',
            }}
                 onScroll={() => onScroll()} ref={listInnerRef}>
                {children}
            </div>
        </div>
    );
};

export default MyList;
