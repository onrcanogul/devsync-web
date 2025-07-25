import React from 'react';
import {
  Box,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Popover,
  Typography,
  Slider,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  DateRange as DateRangeIcon,
  Speed as SpeedIcon,
  Person as PersonIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

export interface CommitFilters {
  search: string;
  types: string[];
  authors: string[];
  dateRange: [number, number];
  impactScore: [number, number];
  onlyWithAnalysis: boolean;
}

interface CommitFilterPanelProps {
  filters: CommitFilters;
  onFiltersChange: (filters: CommitFilters) => void;
  authors: { name: string; avatar: string }[];
  onReset: () => void;
}

const CommitFilterPanel: React.FC<CommitFilterPanelProps> = ({
  filters,
  onFiltersChange,
  authors,
  onReset,
}) => {
  const [dateAnchorEl, setDateAnchorEl] = React.useState<null | HTMLElement>(null);
  const [impactAnchorEl, setImpactAnchorEl] = React.useState<null | HTMLElement>(null);
  const [authorAnchorEl, setAuthorAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleAuthorToggle = (author: string) => {
    const newAuthors = filters.authors.includes(author)
      ? filters.authors.filter(a => a !== author)
      : [...filters.authors, author];
    onFiltersChange({ ...filters, authors: newAuthors });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          size="small"
          placeholder="Commit mesajında ara..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: 'background.paper',
              borderRadius: 2,
            }
          }}
        />

        <Stack direction="row" spacing={1}>
          {['feature', 'bugfix', 'refactor', 'other'].map((type) => (
            <Chip
              key={type}
              label={type}
              onClick={() => handleTypeToggle(type)}
              variant={filters.types.includes(type) ? 'filled' : 'outlined'}
              color={filters.types.includes(type) ? 'primary' : 'default'}
              size="small"
            />
          ))}
        </Stack>

        <Tooltip title="Yazarlar">
          <Chip
            icon={<PersonIcon />}
            label={filters.authors.length ? `${filters.authors.length} yazar` : 'Yazarlar'}
            onClick={(e) => setAuthorAnchorEl(e.currentTarget)}
            variant={filters.authors.length ? 'filled' : 'outlined'}
            color={filters.authors.length ? 'primary' : 'default'}
            size="small"
          />
        </Tooltip>

        <Tooltip title="Tarih Aralığı">
          <Chip
            icon={<DateRangeIcon />}
            label={`Son ${filters.dateRange[1]} gün`}
            onClick={(e) => setDateAnchorEl(e.currentTarget)}
            variant="outlined"
            size="small"
          />
        </Tooltip>

        <Tooltip title="Etki Skoru">
          <Chip
            icon={<SpeedIcon />}
            label={`Etki: ${filters.impactScore[0]}-${filters.impactScore[1]}`}
            onClick={(e) => setImpactAnchorEl(e.currentTarget)}
            variant="outlined"
            size="small"
          />
        </Tooltip>

        {(filters.search || filters.types.length > 0 || filters.authors.length > 0) && (
          <Tooltip title="Filtreleri Temizle">
            <IconButton size="small" onClick={onReset}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Popover
        open={Boolean(authorAnchorEl)}
        anchorEl={authorAnchorEl}
        onClose={() => setAuthorAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { mt: 1, p: 1, maxHeight: 300 }
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ maxWidth: 300 }}>
          {authors.map((author) => (
            <Chip
              key={author.name}
              avatar={<img src={author.avatar} alt={author.name} />}
              label={author.name}
              onClick={() => handleAuthorToggle(author.name)}
              variant={filters.authors.includes(author.name) ? 'filled' : 'outlined'}
              color={filters.authors.includes(author.name) ? 'primary' : 'default'}
              size="small"
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
      </Popover>

      <Popover
        open={Boolean(dateAnchorEl)}
        anchorEl={dateAnchorEl}
        onClose={() => setDateAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { mt: 1, p: 2, width: 300 }
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Son X Gün
        </Typography>
        <Slider
          value={filters.dateRange[1]}
          onChange={(_, newValue) => 
            onFiltersChange({ ...filters, dateRange: [1, newValue as number] })}
          valueLabelDisplay="auto"
          min={1}
          max={90}
          marks={[
            { value: 1, label: '1g' },
            { value: 30, label: '30g' },
            { value: 90, label: '90g' },
          ]}
        />
      </Popover>

      <Popover
        open={Boolean(impactAnchorEl)}
        anchorEl={impactAnchorEl}
        onClose={() => setImpactAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { mt: 1, p: 2, width: 300 }
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Etki Skoru
        </Typography>
        <Slider
          value={filters.impactScore}
          onChange={(_, newValue) =>
            onFiltersChange({ ...filters, impactScore: newValue as [number, number] })}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          marks={[
            { value: 0, label: '0' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
          ]}
        />
      </Popover>
    </Box>
  );
};

export default CommitFilterPanel; 