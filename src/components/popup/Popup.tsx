import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { PopupProvider, PopupRecord } from "./PopupProvider";
import { Typography, styled, Theme, Button, Box, useTheme, SimplePaletteColorOptions } from "@mui/material";

export type PopupModel<T> = {
    id: string;
    name: string;
    body: React.ReactNode;
    icon: React.ReactNode,
    data: T;
    title: string;
}

export const PopupWrapper = styled('div', {})(({ theme }: { theme: Theme }) => ({
    width: "568px",
    height: "480px",
    border: `1px solid ${theme.palette.divider}`,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: theme.zIndex.drawer * 2,
    backgroundColor: theme.palette.background.default,
    resize: "both",
    overflow: "auto",
    minWidth: "300px",
    minHeight: "300px",
    borderRadius: theme.shape.borderRadius,
}));

const PopupHeader = styled("header", {})(({ theme }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "grab",
    backgroundColor: theme.palette.grey[50],
}));

const PopupBody = styled("main", {})(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexGrow: "1",
    width: "100%",
    overflow: "auto",
}));

const PopupFooter = styled("footer", {})(({ theme }) => ({
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: theme.palette.grey[50],
}));

export const Popup = <T extends any>({ popup }: { popup: PopupRecord<T> }) => {
    const theme = useTheme();

    const { closePopup, focusPopup, hidePopup, updatePopup } = PopupProvider.usePopups();

    // State to track the position of the popup
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const popupRef = useRef<HTMLDivElement>(null);
    const [isMaximized, setIsMaximized] = useState(false);

    // Event handler for starting drag
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        focusPopup(popup);
        setIsDragging(true);
        setOffset({
            x: e.clientX - popup.x,
            y: e.clientY - popup.y
        });
    };

    // Event handler for ending drag
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Event handler for moving popup
    const handleMouseMove = (e: MouseEvent) => {
        setIsMaximized(false);
        if (!popupRef.current) return;
        if (!isDragging) return;
        updatePopup({
            id: popup.id,
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        });
    };

    // Attach mouse move and mouse up event listeners to window
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    useLayoutEffect(() => {
        if (popupRef.current && popup.x == 0 && popup.y == 0) {
            updatePopup({
                id: popup.id,
                x: window.innerWidth / 2 - popupRef.current.offsetWidth / 2,
                y: window.innerHeight / 2 - popupRef.current.offsetHeight / 2
            });
        }
    }, []);

    const getStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {
            top: popup.y,
            left: popup.x,
            position: 'fixed'
        };

        if (!isMaximized) return style;

        return {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            position: 'fixed'
        };
    }

    const getHeaderButtonStyles = (color: SimplePaletteColorOptions) => {
        return {
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: color.main,
            cursor: "pointer",
            transition: theme.transitions.create(['backgroundColor'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            "&:hover": {
                backgroundColor: color.dark,
            }
        }
    }

    return (
        <PopupWrapper
            ref={popupRef}
            key={popup.id}
            onClick={() => focusPopup(popup)}
            onDoubleClick={() => setIsMaximized(!isMaximized)}
            style={getStyle()}
        >
            <PopupHeader onMouseDown={handleMouseDown}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Box display="flex" alignItems="center" fontSize={18}>{popup.icon}</Box>

                    <Typography lineHeight={1} variant="h6">{popup.title}</Typography>
                </Box>

                <Box gap={1} display="flex" alignItems="center">
                    <Box onClick={() => setIsMaximized(!isMaximized)} sx={getHeaderButtonStyles(theme.palette.success)}></Box>
                    <Box onClick={() => hidePopup(popup)} sx={getHeaderButtonStyles(theme.palette.warning)}></Box>
                    <Box onClick={() => closePopup(popup)} sx={getHeaderButtonStyles(theme.palette.error)}></Box>

                    {/* <button onClick={() => hidePopup(popup)}>_</button>
                    <button onClick={() => setIsMaximized(true)}>O</button>
                    <button onClick={() => closePopup(popup)}>X</button> */}
                </Box>
            </PopupHeader>

            <PopupBody>
                {popup.body}
            </PopupBody>

            <PopupFooter>
                <Button size="small" color="secondary" onClick={() => closePopup(popup)}>Close</Button>
            </PopupFooter>
        </PopupWrapper>
    );
};