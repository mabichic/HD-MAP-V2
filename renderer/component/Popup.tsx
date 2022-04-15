import { IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from "@mui/material";
import { MouseEventHandler, Ref } from "react";
import styles from './HdMap.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from "@mui/styles";
interface PopupProps {
    content: Array<any>;
}

const PopupTableCell = styled(TableCell)({
    borderBottom: "none",
    padding:'3px'
});
const PopupKeyTableCell = styled(PopupTableCell)({
    backgroundColor: '#ECF2FF'
});
const PopupValueTableCell = styled(PopupTableCell)({
    backgroundColor: '#ffffff'
});


export default function Popup({ content }: PopupProps) {

    return (
        <TableContainer>
            <TableHead>
                <TableRow>
                    <PopupKeyTableCell>Key</PopupKeyTableCell>
                    <PopupValueTableCell>Value</PopupValueTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {content && (
                    Object.entries(content).map(([attKey, attValue]) => {
                        return (
                            <TableRow key={attKey}>
                                <PopupKeyTableCell sx={{ backgroundColor: '#ECF2FF' }}>{attKey}</PopupKeyTableCell>
                                <PopupValueTableCell>{attValue}</PopupValueTableCell>
                            </TableRow>
                        )
                    })
                )}
            </TableBody>
        </TableContainer>


    )
}

