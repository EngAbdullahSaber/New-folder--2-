// React & Next Imports
export { useState, useEffect, useCallback, useMemo, useContext, useRef } from 'react'
export { useParams, useSearchParams, useRouter } from 'next/navigation'
export { useSession } from 'next-auth/react'

// Material UI — Named exports only (replaces `export * from '@mui/material'` which broke tree-shaking)

export { default as Tab } from '@mui/material/Tab'
export { default as TabContext } from '@mui/lab/TabContext'
export { default as TabPanel } from '@mui/lab/TabPanel'
export { default as TabList } from '@mui/lab/TabList'

export { toast } from 'react-toastify'
export {
  Grid,
  Stack,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  Chip,
  Avatar,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Drawer,
  Modal,
  Popover,
  Popper,
  Menu,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Alert,
  AlertTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  Breadcrumbs,
  Link,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  alpha,
  useTheme,
  useMediaQuery,
  styled,
  SvgIcon,
  InputAdornment,
  OutlinedInput,
  Input,
  InputBase,
  Collapse,
  Fade,
  Grow,
  Slide,
  Zoom,
  ClickAwayListener,
  Portal,
  Toolbar,
  AppBar,
  Container,
  GlobalStyles,
  CssBaseline,
  useColorScheme
 } from '@mui/material'
// React Hook Form Imports
export { useForm, FormProvider, Controller, useFormContext } from 'react-hook-form'
export type { SubmitHandler, DefaultValues, FieldValues, UseFormReturn } from 'react-hook-form'
export { format } from 'date-fns'

// Valibot Imports
export { valibotResolver } from '@hookform/resolvers/valibot'
// export { string, number, boolean, mixed } from 'yup';

// Hooks and Utilities
export * from '@/utils/api'
export * from '@/utils/error'
export * from '@/utils/navigation'
export * from '@/hooks/useSessionHandler'
export * from '@/libs/SharedFunctions'
export * from '@/hooks/useRecordForm'
export * from '@/hooks/useRecordList'
export * from '@/hooks/useCityAccess'
export * from '@/hooks/useCascadeFields'
export * from '@/contexts/tabsContext'
export * from '@/utils/common-static-list'
export * from '@/libs/eventBus'
export { usePrintMode } from '@/contexts/usePrintModeContext'
export { LoadingContext } from '@/contexts/loadingContext'
// Types
export type { Mode } from '@/types/pageModeType'
export type { SearchMode } from '@/types/pageModeType'
export type { UserFormData } from '@/types/user/userType'
export type { Locale } from '@/configs/i18n'
export type { CustomAutocompleteProps, Option } from '@/types/components/listOfValue'
export type { DynamicFormTableProps } from '@/types/components/dynamicFormDetailsTable'
export type * from '@/types/components/dynamicDataTable'
export type { PaginatedTableProps } from '@/types/components/dynamicTablePagination'
export type { HeaderOption } from '@/types/components/headerOptions'
export type { MenuOption } from '@/types/components/rowOptions'
export type * from '@/types/components/dynamicFormField'
export type { InferFieldType } from '@/types/generateInterface'
export type { DynamicFormTableFieldProps } from '@/types/components/dynamicFormDetailsTable'
// src/shared/index.ts (أو أي ملف exports)
// أضف هذا
export type { TabConfig, TabContentProps, DialogDetailsFormContextType } from '@/types/components/dialogDetailsForm'
// Shared Components
export { ListOfValue } from '@/components/shared/ListOfValue'
export { DynamicTable } from '@/components/shared/DynamicDataTable'
export { DynamicFormTable } from '@/components/shared/DynamicFormTable'
export { default as GenericSelectionTable } from '@/components/shared/GenericSelectionTable'
export type { ColumnConfig as GenericTableColumnConfig } from '@/components/shared/GenericSelectionTable'
export { Header } from '@/components/shared/FormHeader'
export { CustomTablePagination } from '@/components/shared/TablePagination'
export { DynamicFormField } from '@/components/shared/DynamicFormField'
export { FormComponent } from '@/components/shared/FormComponent'
export { FormTabComponent } from '@/components/shared/FormTabComponent'
export { ListComponent } from '@/components/shared/ListComponent'
export { OTPVerificationModal } from '@/components/shared/OTPVerificationModal'
// export { EntityDetails } from '@/components/shared/EntityDetails'
export { FormActions } from '@/components/shared/FormActions'
export { showDeleteSummaryToast } from '@/components/shared/MultiDeleteResponse'
export { FileUploadWithTabs } from '@/components/shared/FileUploadWithTabs'
export { RecordInformation } from '@/components/shared/RecordInformation'
export { RecordTracking } from '@/components/shared/RecordTracking'
export { default as LoadingSpinner } from '@/components/shared/LoadingSpinner'
export { Box } from '@mui/material'
export { RolesTable } from '@/components/shared/RolesTable'
export { default as StatCard } from '@/components/shared/StatCard'
export { default as FilterTabs } from '@/components/shared/FilterTabs'

export { CustomIconBtn } from '@/components/shared/CustomIconButton'
export { default as CustomAvatar } from '@/@core/components/mui/Avatar'
export { CustomTooltipButton } from '@/components/shared/CustomTooltipButton'
export { SharedForm } from '@/components/shared/tabs-stacked'
export { HeaderPrint } from '@/components/shared/header-print'
export { FooterPrint } from '@/components/shared/footer-print'
export { DialogDetailsFormModal } from '@/components/shared/DialogDetailsFormModal'
export { ModalFieldsRenderer } from '@/components/shared/ModalFieldsRenderer'
export { CheckboxRadioGrid } from '@/components/shared/CheckboxRadioGrid'
export { DynamicGroupedRatingTable } from '@/components/shared/dynamicGroupedRatingTable'
export { ColorPickerField } from '@/components/shared/ColorPickerField'
export { IconPickerField } from '@/components/shared/IconPickerField'
export { GenericSettingsDialog } from '@/components/shared/GenericSettingsDialog'
export type { ListSettingField } from '@/components/shared/GenericSettingsDialog'

export { default as MapViewer } from '@/components/shared/MapViewer'
export { FormMapCard } from '@/components/shared/FormMapCard'

// Styles
// Import the print.css (this will ensure it's available wherever shared is imported)
import '@/shared/styles/print.css'
import '@/shared/styles/styles.css'
import '@/shared/styles/responsive-table.module.css'

// shared files
export { default as apiClient } from '@/app/api/shared/ApiClient'

// i18
export { getLocalizedUrl } from '@/utils/i18n'
