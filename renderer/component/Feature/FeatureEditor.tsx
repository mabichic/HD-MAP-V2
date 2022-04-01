import { Box, Button, Divider, IconButton, ListItem, ListItemIcon, ListItemText, MenuItem, Modal, Select, SvgIcon, TextField, Typography } from "@mui/material";

import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 332,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 0,
};
function FeatureEditor({ handleClose, open }) {

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div style={{ width: '100%', backgroundColor: "#30459A" }}>
                    <ListItem sx={{ paddingTop: '3px', paddingBottom: '3px' }}>
                        <ListItemIcon sx={{ fontSize: 10, minWidth: '30px' }}>
                            <SvgIcon sx={{ width: '20px' }}>
                                <SettingsIcon sx={{ color: "#fff" }} />
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText sx={{ color: "#fff" }}>
                            <Typography variant="subtitle2">
                                Field Edit
                            </Typography>
                        </ListItemText>
                        <IconButton onClick={handleClose}>
                            <CloseIcon fontSize="small" sx={{ fill: '#fff' }} />
                        </IconButton>
                    </ListItem>
                </div>

                <Typography id="modal-modal-title" variant="body2" component="h2" p={3} sx={{ color: "#30459A" }}>
                    "선택된 필드의 속성값을 수정합니다."
                </Typography>
                <Typography id="modal-modal-title" variant="h6" sx={{ marginLeft: '20px' }}>
                    Field
                </Typography>

                <Select
                    size="small"
                    sx={{ width: '133px', marginLeft: '20px' }}
                    value={10}
                    // onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Mid</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                <Typography id="modal-modal-title" variant="h6" sx={{ marginLeft: '20px', marginTop: '11px' }}>
                    Value
                </Typography>
                <TextField id="standard-basic" variant="outlined" sx={{ marginLeft: '20px', width: '294px', marginBottom: '27px' }} size="small" />
                <Divider />
                <div style={{textAlign:'right'}}>

                    <Button variant="outlined" href="#outlined-buttons" sx={{ marginLeft: '20px', marginTop: '20px', marginBottom: '20px', marginRight:'8px' , width:'80px'}}>
                        확인
                    </Button>
                    <Button variant="outlined" href="#outlined-buttons" sx={{marginRight:'20px', width:'80px'}} color="error" onClick={handleClose}>
                        취소
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}

export default FeatureEditor;