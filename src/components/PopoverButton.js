import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';

const PopoverButton = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const toggleOpen = (e) => {
        if (open) {
            closePopup();
        } else {
            setOpen(true);
            setAnchorEl(e.currentTarget);
        }
    };

    const closePopup = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton onClick={toggleOpen}>
                <BsThreeDotsVertical />
            </IconButton>
            <Popover
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={closePopup}
            >
                {children}
            </Popover>
        </>
    );
};

export default PopoverButton;
