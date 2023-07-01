import React, {useState, useCallback, useEffect, useMemo} from "react";
import {
    Stack,
    OutlinedInput,
    InputLabel,
    MenuItem,
    Chip,
    Select,
    FormControl,
    Collapse,
    List,
    ListItem,
    Checkbox,
    Box,
    InputAdornment,
} from "@mui/material";
import {makeStyles} from '@mui/styles';
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BackspaceIcon from '@mui/icons-material/Backspace';
// import '../../../styles/framework/widgets/multiSelect.less';


const useStyles = makeStyles((theme) => ({
    searchInput: {
        backgroundColor: '#F7F7F7',
        borderRadius: '50px',
        height: '32px',
        margin: '0 auto',
        fontSize: 'inherit',
    },
    menuItem: {
        height: '32px',
        '& .MuiCheckbox-root': {
            padding: '0',
            marginRight: '10px',
        },
    },
    searchContainer: {
        padding: '15px 0 15px 0',
        margin: '-10px 0 0 0',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        backgroundColor: '#FFF',
        display: 'flex',
        justifyContent: 'center',
    },
    groupContainer: {
        maxHeight: 'calc(100% - 40px)',
        overflowY: 'auto',
    },
    checkBoxStyle: {
        height: '20px',
        width: '20px',
    },
    groupText: {
        fontSize: '12px',
        color: '#121212',
        fontWeight: 'normal',
        flex: 1
    },
    arrowStyle: {
        marginRight: '10px',
        width: '18px',
        height: '18px'
    },
    checkBoxGroup: {
        height: '20px',
        width: '20px',
        marginRight: '10px'
    },
    menuItemGroup: {
        height: '32px',
        fontSize: '12px',
        color: '#121212',
        fontWeight: 'normal',
        '& .MuiCheckbox-root': {
            padding: '0',
            marginRight: '10px',
            height: '20px',
            width: '20px',
        },
    },
    chip: {
        fontSize: '14px',
        height: 'auto',
        padding: '2px 8px',
        zIndex: 9999,
    },
    backspaceContainer: {
        marginLeft: 'auto',
        marginBottom: 'auto',
        padding: '8px',
        zIndex: 9999
    },
    backspaceIcon: {
        fontSize: '18px',
        margin: '0 0 0 100%'
    },
}));


export const MultiSelect = ({elements, lable, options, itemTemplate}) => {
    const classes = useStyles();
    const [selectedItems, setSelectedItems] = useState([]);
    const [openGroups, setOpenGroups] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [touched, setTouched] = useState(false);

    const filteredTestArr = useMemo(() => {
        return elements
            .map((group) => {
                const titleMatches = group.title ? group.title.toLowerCase().includes(searchQuery.toLowerCase()) : false;
                const items = group.group || [];
                const filteredItems = items.filter((item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (titleMatches) {
                    return group;
                } else if (filteredItems.length > 0) {
                    return {
                        ...group,
                        group: filteredItems,
                    };
                }
                return null;
            })
            .filter((group) => group !== null);
    }, [elements, searchQuery]);

    const handleSearchChange = useCallback((event) => {
        setSearchQuery(event.target.value);
    }, [])


    const handleItemClick = useCallback((item) => {
        setSelectedItems((prevSelected) => {
            const isAlreadySelected = prevSelected.some(
                (selectedItem) => selectedItem.value === item.value
            );
            if (isAlreadySelected) {
                return prevSelected.filter(
                    (selectedItem) => selectedItem.value !== item.value
                );
            } else {
                if (!options.multiple) {
                    setSelectedItems([item])
                } else {
                    return [...prevSelected, item];
                }
            }
        });
    }, []);

    const handleDelete = useCallback((value, event) => {
        event.stopPropagation();
        setSelectedItems((prevSelected) =>
            prevSelected.filter((item) => item.value !== value)
        );
    }, []);

    const handleDeleteAll = useCallback(() => {
        setSelectedItems([]);
    }, []);

    const toggleGroup = useCallback((groupName) => {
        setOpenGroups((prevGroups) => ({
            ...prevGroups,
            [groupName]: !prevGroups[groupName],
        }));
    }, []);

    const handleSelectAll = useCallback((groupItems) => {
        setSelectedItems((prevSelected) => {
            const isSelected = groupItems.every((item) =>
                prevSelected.some((selectedItem) => selectedItem.value === item.value)
            );

            if (isSelected) {
                return prevSelected.filter(
                    (selectedItem) =>
                        !groupItems.some((item) => item.value === selectedItem.value)
                );
            } else {
                return [
                    ...prevSelected,
                    ...groupItems.filter(
                        (item) =>
                            !prevSelected.some(
                                (selectedItem) => selectedItem.value === item.value
                            )
                    ),
                ];
            }
        });
    }, []);

    useEffect(() => {
        const inputBorder = document.querySelectorAll('.css-1o9s3wi-MuiInputBase-input-MuiOutlinedInput-input')[0]
        if (inputBorder) {
            inputBorder.style.setProperty('border', 'none', 'important')
        }
        if (!open) {
            setTimeout(() => {
                setSearchQuery("");
            }, 500);
        }

    }, [open]);

    useEffect(() => {
        options.onChange(selectedItems);
    }, [selectedItems]);

    return (
        <FormControl sx={{m: 1, width: 300}} required={options.required}
                     error={options.required && touched && selectedItems.length === 0}>
            <InputLabel className='inputLabel'>{lable}</InputLabel>
            <Select
                multiple
                value={selectedItems}
                sx={{borderRadius: 0}}
                className='select'
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Stack gap={1} direction="row" flexWrap="wrap">
                            {selected.map((value) => (
                                <Chip
                                    key={value.value}
                                    label={value.value}
                                    onDelete={() => handleDelete(value.value)}
                                    className={classes.chip}
                                    deleteIcon={<CancelIcon
                                        sx={{width: '14px', height: '14px', display: options.multiple ? "" : 'none'}}
                                        onMouseDown={(event) => handleDelete(value.value, event)}/>}
                                />
                            ))}
                        </Stack>
                        {open && selectedItems.length > 0 && (
                            <IconButton
                                className={classes.backspaceContainer}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleDeleteAll()
                                }}
                            >
                                <BackspaceIcon className={classes.backspaceIcon}/>
                            </IconButton>
                        )}
                    </Box>
                )}
                MenuProps={{
                    disablePortal: true,
                    PaperProps: {
                        style: {
                            maxHeight: 400,
                            overflowY: 'auto',
                            margin: '5px 0 0 0'
                        },
                    },
                }}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                    setTouched(true);
                }}
            >

                <Box style={{position: 'relative'}}>
                    {options.search ? <Box className={classes.searchContainer}>
                        <OutlinedInput
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            sx={{borderRadius: '50px'}}
                            className={classes.searchInput}
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconButton>
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </Box> : ""}

                    <Box className={classes.groupContainer}>
                        {filteredTestArr.map((group, index) => {
                            const groupItems = group.group || [];
                            return (
                                <Box key={index}>
                                    {groupItems.length > 0 ? (
                                        <>
                                            <MenuItem className={classes.menuItem}>
                                                <Checkbox
                                                    className={classes.checkBoxStyle}
                                                    style={!options.multiple ? {display: 'none'} : {}}
                                                    checked={groupItems.every((item) =>
                                                        selectedItems.some((selectedItem) => selectedItem.value === item.value)
                                                    )}
                                                    onChange={() => handleSelectAll(group.group)}
                                                />

                                                <span
                                                    onClick={() => toggleGroup(group.title)}
                                                    className={classes.groupText}
                                                >
                      {group.title}
                    </span>
                                                {openGroups[group.title] ? (
                                                    <ExpandLessIcon
                                                        className={classes.arrowStyle}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            toggleGroup(group.title);
                                                        }}
                                                    />
                                                ) : (
                                                    <ExpandMoreIcon
                                                        className={classes.arrowStyle}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            toggleGroup(group.title);
                                                        }}
                                                    />
                                                )}
                                            </MenuItem>
                                            <Collapse in={openGroups[group.title]} timeout="auto" unmountOnExit>
                                                <List component="div" disablePadding>
                                                    {groupItems.map((item, idx) => (
                                                        <ListItem
                                                            key={idx}
                                                            button
                                                            sx={{
                                                                paddingLeft: 6,
                                                                fontSize: '12px',
                                                                color: '#121212',
                                                                fontWeight: 'normal',
                                                                height: '32px',
                                                            }}
                                                            onClick={() => handleItemClick(item)}
                                                        >
                                                            <Checkbox
                                                                className={classes.checkBoxStyle}
                                                                style={!options.multiple ? {display: 'none'} : {}}
                                                                checked={selectedItems.some((selectedItem) => selectedItem.value === item.value)}
                                                            />
                                                            {itemTemplate ? itemTemplate(item) :
                                                                <span>{item.title}</span>}
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Collapse>
                                        </>
                                    ) : (
                                        <MenuItem sx={{
                                            height: '32px',
                                            fontSize: '12px',
                                            color: '#121212',
                                            fontWeight: 'normal',
                                            '& .MuiCheckbox-root': {
                                                padding: '0',
                                                marginRight: '10px',
                                                height: '20px',
                                                width: '20px',
                                            },
                                        }}
                                                  onClick={() => handleItemClick(group)}
                                        >
                                            <Checkbox
                                                className={classes.checkBoxStyle}
                                                style={!options.multiple ? {display: 'none'} : {}}
                                                checked={selectedItems.some((selectedItem) => selectedItem.value === group.value)}
                                            />
                                            {itemTemplate ? itemTemplate(group) : <span>{group.title}</span>}
                                        </MenuItem>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Select>
            {options.required && touched && selectedItems.length === 0 && (
                <div style={{color: 'red', fontSize: '14px'}}>Please select at least one item.</div>
            )}
        </FormControl>
    );
};

