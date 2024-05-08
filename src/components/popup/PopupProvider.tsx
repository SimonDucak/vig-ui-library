import { createContext, useContext, useState } from "react";
import { PopupModel, Popup } from "./Popup";

export type PopupRecord<T> = PopupModel<T> & {
    hidden: boolean;
    x: number;
    y: number;
};

type PopupProviderState = {
    popups: PopupRecord<any>[];
    addPopup: (popup: PopupModel<any>) => void;
    closePopup: (popup: PopupModel<any>) => void;
    focusPopup: (popup: PopupModel<any>) => void;
    hidePopup: (popup: PopupModel<any>) => void;
    openPopup: (popup: PopupModel<any>) => void;
    updatePopup: (popup: { id: string } & Partial<PopupRecord<any>>) => void;
    hideAllPopups: () => void;
};

const initialState: PopupProviderState = {
    popups: [],
    addPopup: () => { },
    closePopup: () => { },
    focusPopup: () => { },
    hidePopup: () => { },
    openPopup: () => { },
    updatePopup: () => { },
    hideAllPopups: () => { },
};

const PopupProviderContext = createContext<PopupProviderState>(initialState);

type PopupProviderProps = {
    children: React.ReactNode;
}

export const PopupProvider = ({ children }: PopupProviderProps) => {
    const [popups, setPopups] = useState<PopupRecord<any>[]>([]);

    const addPopup = (popup: PopupModel<any>) => {
        const foundPopup = popups.find((p) => p.id === popup.id);

        if (foundPopup) {
            openPopup(foundPopup);
            return;
        }

        setPopups((prevPopups) => [...prevPopups, {
            ...popup,
            hidden: false,
            x: 0,
            y: 0,
        }]);
    }

    const closePopup = (popup: PopupModel<any>) => {
        const filteredPopups = popups.filter((p) => p.id !== popup.id);
        setPopups(filteredPopups);
    }

    const hideAllPopups = () => {
        setPopups(popups.map((p) => ({ ...p, hidden: true })));
    }

    const updatePopup = (data: { id: string } & Partial<PopupRecord<any>>) => {
        const index = popups.findIndex((p) => p.id === data.id);
        if (index === -1) return;
        setPopups((prevPopups) => [
            ...prevPopups.slice(0, index),
            { ...popups[index], ...data },
            ...prevPopups.slice(index + 1),
        ]);
    }

    const focusPopup = (popup: PopupModel<any>) => {
        if (popups[popups.length - 1].id === popup.id) return;
        const foundPopup = popups.find((p) => p.id === popup.id);
        if (!foundPopup) return;
        setPopups((prevPopups) => [...prevPopups.filter((p) => p.id !== popup.id), {
            ...foundPopup,
            hidden: false,
        }]);
    }

    const hidePopup = (popup: PopupModel<any>) => {
        updatePopup({ ...popup, hidden: true });
    }

    const openPopup = (popup: PopupModel<any>) => {
        updatePopup({ ...popup, hidden: false });
        focusPopup(popup);
    }

    const value = {
        popups,
        addPopup,
        closePopup,
        focusPopup,
        hidePopup,
        openPopup,
        updatePopup,
        hideAllPopups,
    };

    return (
        <PopupProviderContext.Provider value={value}>
            {children}

            <>
                {popups
                    .filter(p => !p.hidden)
                    .map((popup) => <Popup popup={popup} key={popup.id} />)}
            </>
        </PopupProviderContext.Provider>
    );
}

PopupProvider.usePopups = () => {
    const context = useContext(PopupProviderContext);

    if (!context) {
        throw new Error("useApplication must be used within a PopupProvider");
    }

    return context;
};