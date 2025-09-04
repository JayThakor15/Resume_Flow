import React from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";

const AISuggestionPanel = ({
  loading,
  data, // { corrected, keywords: [], suggestions: [] }
  onApply,
  onRegenerate,
  title = "AI Suggestions",
}) => {
  return (
    <Box
      sx={{
        p: 2,
        borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
        minWidth: 320,
        width: 360,
        bgcolor: (theme) => theme.palette.background.paper,
        position: "sticky",
        top: 80,
        height: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Regenerate">
            <span>
              <IconButton
                onClick={onRegenerate}
                disabled={loading}
                size="small"
              >
                {loading ? <CircularProgress size={18} /> : <RefreshIcon />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Apply suggestion">
            <span>
              <IconButton
                onClick={onApply}
                disabled={loading || !data?.corrected}
                size="small"
                color="primary"
              >
                <CheckIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {data?.corrected && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Improved Text
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {data.corrected}
          </Typography>
        </Box>
      )}

      {Array.isArray(data?.keywords) && data.keywords.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Suggested Keywords
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {data.keywords.map((k, idx) => (
              <Chip key={idx} label={k} size="small" variant="outlined" />
            ))}
          </Stack>
        </Box>
      )}

      {Array.isArray(data?.suggestions) && data.suggestions.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Notes
          </Typography>
          <Stack spacing={1}>
            {data.suggestions.map((s, idx) => (
              <Typography key={idx} variant="body2">
                • {s}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AISuggestionPanel;
