import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
export var LeafletRightClickContext = createContext({});
export var LeafletRightClickProvider = function (_a) {
    var children = _a.children;
    var _b = useState(null), rightClickEvent = _b[0], setRightClickEvent = _b[1];
    return (React.createElement(LeafletRightClickContext.Provider, { value: {
            rightClickEvent: rightClickEvent,
            setRightClickEvent: setRightClickEvent
        } }, children));
};
export var useLeafletRightClick = function () {
    var rightClickEvent = useContext(LeafletRightClickContext).rightClickEvent;
    return rightClickEvent;
};
var ReactLeafletRightClick = function (props) {
    var onRightClick = props.onRightClick, CustomComponent = props.customComponent;
    var setRightClickEvent = useContext(LeafletRightClickContext).setRightClickEvent;
    var getContext = useLeafletContext();
    var mapContext = useRef(getContext);
    var mapSize = useRef();
    var menuWrapRef = useRef(null);
    var _a = useState(false), isShowMenu = _a[0], setIsShowMenu = _a[1];
    var _b = useState({
        x: 0,
        y: 0
    }), point = _b[0], setPoint = _b[1];
    useEffect(function () {
        if (mapContext.current.map) {
            mapSize.current = mapContext.current.map.getSize();
            mapContext.current.map.on('click dragstart zoom', function () {
                setIsShowMenu(false);
            });
            mapContext.current.map.on('resize', function (event) {
                mapSize.current = event.newSize;
            }, []);
            // CHECK MENU HEIGHT
            var menuPointYisOverFlow_1 = function (pointY, menuWrapHeight, mapSize) {
                if (pointY > (mapSize.y - menuWrapHeight))
                    return pointY - menuWrapHeight;
                else
                    return pointY;
            };
            mapContext.current.map.on('contextmenu', function (event) {
                setRightClickEvent(event);
                onRightClick && onRightClick(event);
                var pointRightClick = event.containerPoint;
                var menuWrapWidth = menuWrapRef.current ? Number(menuWrapRef.current.offsetWidth) : 0;
                var menuWrapHeight = menuWrapRef.current ? Number(menuWrapRef.current.offsetHeight) : 0;
                // CHECK IF CLICK POSITION OVERFLOW X AND Y
                if (mapSize.current && pointRightClick.x > (mapSize.current.x - menuWrapWidth)) {
                    // CHECK MAX POINT X
                    var calculationX = pointRightClick.x === mapSize.current.x
                        ? (pointRightClick.x - menuWrapWidth) - 20
                        : pointRightClick.x - menuWrapWidth;
                    setPoint({
                        y: menuPointYisOverFlow_1(pointRightClick.y, menuWrapHeight, mapSize.current),
                        x: calculationX
                    });
                }
                else {
                    mapSize.current && setPoint({
                        y: menuPointYisOverFlow_1(pointRightClick.y, menuWrapHeight, mapSize.current),
                        x: pointRightClick.x
                    });
                }
                setIsShowMenu(true);
            });
        }
    }, []);
    // MAP CONTEXT NOT FOUND
    if (!getContext)
        return null;
    return (React.createElement("div", { ref: menuWrapRef, style: {
            display: isShowMenu ? 'block' : 'none',
            position: 'absolute',
            zIndex: 10000,
            top: "".concat(point.y, "px"),
            left: "".concat(point.x, "px"),
        } }, CustomComponent && CustomComponent));
};
export default ReactLeafletRightClick;
