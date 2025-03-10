import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  IconButton,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Description as DescriptionIcon,
  InsertDriveFile as InsertDriveFileIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon
} from '@mui/icons-material';

/**
 * FileList component displays a list of files for a course
 */
function FileList({ 
  files, 
  onAddClick, 
  onDownloadClick, 
  onDeleteClick, 
  formatDate,
  formatFileSize
}) {
  // Function to determine the icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return <PictureAsPdfIcon />;
    } else if (fileType.includes('image')) {
      return <ImageIcon />;
    } else if (fileType.includes('document') || fileType.includes('text')) {
      return <DescriptionIcon />;
    } else {
      return <InsertDriveFileIcon />;
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Files</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          Add File
        </Button>
      </Box>

      {files.length > 0 ? (
        <Grid container spacing={3}>
          {files.map((file) => (
            <Grid item xs={12} md={6} lg={4} key={file.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box mr={2} display="flex" alignItems="center" justifyContent="center" sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: 'action.hover',
                      borderRadius: 1
                    }}>
                      {getFileIcon(file.file_type)}
                    </Box>
                    <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="subtitle1" noWrap title={file.filename}>
                        {file.filename}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFileSize(file.file_size)} • {formatDate(file.uploaded_at)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip 
                      label={file.file_type.split('/')[1]?.toUpperCase() || file.file_type} 
                      size="small" 
                      variant="outlined"
                    />
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => onDownloadClick(file)}
                        sx={{ mr: 1 }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => onDeleteClick(file.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No files yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add File" to upload your first file
          </Typography>
        </Box>
      )}
    </>
  );
}

export default FileList;