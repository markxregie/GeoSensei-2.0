import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

const TermsModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#5D4A68' }}>
        Terms and Conditions
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body2" paragraph>
            By accessing and using GeoSensei, you accept and agree to be bound by the terms and provision of this agreement.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Use License
          </Typography>
          <Typography variant="body2" paragraph>
            Permission is granted to temporarily download one copy of the materials on GeoSensei's website for personal, non-commercial transitory viewing only.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Disclaimer
          </Typography>
          <Typography variant="body2" paragraph>
            The materials on GeoSensei's website are provided on an 'as is' basis. GeoSensei makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Limitations
          </Typography>
          <Typography variant="body2" paragraph>
            In no event shall GeoSensei or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GeoSensei's website, even if GeoSensei or a GeoSensei authorized representative has been notified orally or in writing of the possibility of such damage.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Accuracy of Materials
          </Typography>
          <Typography variant="body2" paragraph>
            The materials appearing on GeoSensei's website could include technical, typographical, or photographic errors. GeoSensei does not warrant that any of the materials on its website are accurate, complete, or current.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Links
          </Typography>
          <Typography variant="body2" paragraph>
            GeoSensei has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by GeoSensei of the site.
          </Typography>

          <Typography variant="h6" gutterBottom>
            7. Modifications
          </Typography>
          <Typography variant="body2" paragraph>
            GeoSensei may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </Typography>

          <Typography variant="h6" gutterBottom>
            8. Governing Law
          </Typography>
          <Typography variant="body2" paragraph>
            These terms and conditions are governed by and construed in accordance with the laws of [Your Country/State] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#5D4A68' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsModal;
