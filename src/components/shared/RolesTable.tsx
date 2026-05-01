'use client'

import {
  useState,
  useEffect,
  Card,
  CardHeader,
  IconButton,
  Tooltip,
  TextField,
  Checkbox,
  useSessionHandler,
  Locale,
  useParams,
  toast,
  CircularProgress,
  Box
} from '@/shared'
import tableStyles from '@core/styles/table.module.css'
import { fetchRecords, fetchRecords_GET, handleSave } from '@/utils/api' // Import fetchRecords
import { getDictionary } from '@/utils/getDictionary'
import React from 'react'

interface RolesTableProps {
  apiUrl: string
  title?: string
  pageIndex?: number
  pageSize?: number
  searchQuery?: string
  roleId: any
}
export const RolesTable: React.FC<RolesTableProps> = ({
  apiUrl,
  title = '',
  pageIndex = 0,
  pageSize = 100,
  searchQuery = '',
  roleId = ''
}) => {
  const [rows, setRows] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [updatingRows, setUpdatingRows] = useState<number[]>([])
  const { accessToken } = useSessionHandler()
  const { lang: locale } = useParams()

  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])

  // Fetch data using fetchRecords
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken && apiUrl) {
        try {
          const { data }: any = await fetchRecords_GET(
            apiUrl,
            pageIndex,
            pageSize,
            searchQuery,
            accessToken,
            locale as Locale
          )

          setRows(processObjectToRows(data))
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      } else {
        setRows([])
      }
    }

    fetchData()
  }, [apiUrl, pageIndex, pageSize, searchQuery, accessToken, locale])

  const processObjectToRows = (object: any, level = 0): any[] => {
    let icon: React.JSX.Element = <></>

    switch (object.object_type) {
      case 1:
        icon = <i className='ri-function-line text-primaryDark' color='primary'></i> // system icon, primary dark
        break
      case 2:
        icon = <i className='ri-folder-6-line text-warning'></i> // menu icon, warning main
        break
      case 3:
        icon = <i className='ri-file-2-line text-info'></i> // screen icon, info main
        break
      default:
        icon = <></> // default if no object type matches
    }

    const parentData = {
      label: (
        <div className='flex align-items-center '>
          {icon}
          <span className='ms-2'>{object.object_name_ar}</span> {/* Added margin to space out icon and text */}
        </div>
      ),
      id: object.id,
      show: getInitialValueOfAction(object, 'show') || false,
      print_pdf: getInitialValueOfAction(object, 'print_pdf') || false,
      print_excel: getInitialValueOfAction(object, 'print_excel') || false,
      audit_fields: getInitialValueOfAction(object, 'audit_fields') || false,
      index: getInitialValueOfAction(object, 'index') || false,
      store: getInitialValueOfAction(object, 'store') || false,
      update: getInitialValueOfAction(object, 'update') || false,
      destroy: getInitialValueOfAction(object, 'destroy') || false,
      archive_open: getInitialValueOfAction(object, 'archive_open') || false,
      archive_add: getInitialValueOfAction(object, 'archive_add') || false,
      archive_destroy: getInitialValueOfAction(object, 'archive_destroy') || false,
      // hide: object.hide || false,
      level,
      children: [],
      object_type: object.object_type || null,
      parent_id: object.parent_id || null
    }

    const childrenData = (object.children || []).flatMap((child: any) => processObjectToRows(child, level + 1))

    return [parentData, ...childrenData]
  }

  const normalizeRouteName = (routeName: string) => {
    return routeName.split('.').slice(0, 2).join('.').toLowerCase()
  }

  const getInitialValueOfAction = (object: any, action: string) => {
    if (object.object_type !== 3) return false
    if (!object.permissions?.length) return false

    const objectRoute = normalizeRouteName(object.route_name)

    const permission = object.permissions.find((p: any) => {
      const permissionRoute = normalizeRouteName(p.name)

      return permissionRoute === objectRoute && p.route_action?.toLowerCase() === action.toLowerCase()
    })

    return permission?.is_granted ?? false
  }

  // Handle checkbox changes and update the API
  const handleSingleCheckboxChange = async (rowIndex: number, field: string, checked: boolean) => {
    const updatedRows = [...rows]
    updatedRows[rowIndex][field] = checked

    if (field === 'hide' && checked) {
      Object.keys(updatedRows[rowIndex]).forEach(key => {
        if (key !== 'label' && key !== 'hide' && key !== 'id') {
          updatedRows[rowIndex][key] = false
        }
      })
    }

    setRows(updatedRows)

    try {
      setUpdatingRows(prev => [...prev, rowIndex])
      const rowData = { ...updatedRows[rowIndex] }
      delete rowData.label
      delete rowData.children

      // delete updatedRows[rowIndex]['label']
      const response = await handleSave(`/aut/roles/${roleId}`, locale as Locale, rowData, '', accessToken, false)
      if (!response.status) {
        throw new Error('Failed to update row')
      }
      updatedRows[rowIndex].success = true
      setRows(updatedRows)
      setErrors(errors.filter(error => error.rowIndex !== rowIndex))
    } catch (error: any) {
      updatedRows[rowIndex].success = false
      setRows(updatedRows)
      setErrors([...errors, { rowIndex, message: error?.message || 'لم تتم العملية بنجاح' }])
    } finally {
      setUpdatingRows(prev => prev.filter(i => i !== rowIndex))
    }
  }

  const isRowUpdating = (rowIndex: number) => updatingRows.includes(rowIndex)

  const handleMultiCheckboxChange = async (rowIndex: number, field: string, checked: boolean) => {
    const updatedRows = [...rows]
    const updateChildrenRecursively = (rows: any[], parentId: number, field: string, checked: boolean) => {
      rows.forEach(row => {
        if (Number(row.parent_id) === Number(parentId)) {
          row[field] = checked
          updateChildrenRecursively(rows, row.id, field, checked)
        }
      })
    }
    const targetRow = updatedRows[rowIndex]
    targetRow[field] = checked
    updateChildrenRecursively(updatedRows, targetRow.id, field, checked)

    setRows(updatedRows)

    try {
      setUpdatingRows(prev => [...prev, rowIndex])
      const sanitizedRows = updatedRows.map(row => {
        const newRow = { ...row }
        delete newRow.label
        delete newRow.children
        return newRow
      })
      const response = await handleSave(`/aut/roles/${roleId}`, locale as Locale, sanitizedRows, '', accessToken, false)
      if (!response.status) {
        throw new Error('Failed to update row')
      }

      targetRow.success = true
      setRows(updatedRows)
      setErrors(errors.filter(error => error.rowIndex !== rowIndex))
    } catch (error) {
      targetRow.success = false
      setRows(updatedRows)
      setErrors([...errors, { rowIndex, message: 'Failed to update. Please try again.' }])
    } finally {
      setUpdatingRows(prev => prev.filter(i => i !== rowIndex))
    }
  }

  const handleCheckboxChange = (rowIndex: number, field: string, checked: boolean) => {
    const list = [...rows]

    if (list[rowIndex]['object_type'] == 3) {
      handleSingleCheckboxChange(rowIndex, field, checked)
    } else {
      handleMultiCheckboxChange(rowIndex, field, checked)
    }

    // setTimeout(() => {
    //   toast.success('تم حفظ السجل بنجاح!')
    // }, 1000)
  }

  const handleSingleRowDelete = async (rowIndex: number) => {
    const fields = [
      'print_pdf',
      'print_excel',
      'audit_fields',
      'show',
      'index',
      'store',
      'update',
      'destroy',
      'archive_open',
      'archive_add',
      'archive_destroy'
    ]
    fields.map(field => {
      handleSingleCheckboxChange(rowIndex, field, false)
    })
    // const updatedRows = [...rows]
    // Object.keys(updatedRows[rowIndex]).forEach(key => {
    //   if (key !== 'label' && key !== 'id') {
    //     updatedRows[rowIndex][key] = false
    //   }
    // })

    // setRows(updatedRows)

    // try {
    //   // delete updatedRows[rowIndex]['label']

    //   const response = await handleSave(`/roles/${roleId}`, locale as Locale, updatedRows[rowIndex], '', accessToken)

    //   if (!response.status) {
    //     throw new Error('Failed to update row')
    //   }

    //   // setRows(rows.filter((_, idx) => idx !== rowIndex))
    // } catch (error) {
    //   setErrors([...errors, { rowIndex, message: 'Failed to delete. Please try again.' }])
    // }
  }

  const handleMultiDelete = (rowIndex: number) => {
    const fields = [
      'print_pdf',
      'print_excel',
      'audit_fields',
      'show',
      'index',
      'store',
      'update',
      'destroy',
      'archive_open',
      'archive_add',
      'archive_destroy'
    ]
    fields.map(field => {
      handleMultiCheckboxChange(rowIndex, field, false)
    })
  }

  const handleDelete = async (rowIndex: number) => {
    const list = [...rows]
    if (list[rowIndex]['object_type'] == 3) {
      handleSingleRowDelete(rowIndex)
    } else {
      handleMultiDelete(rowIndex)
    }

    setTimeout(() => {
      toast.success('تم حفظ السجل بنجاح!')
    }, 1000)
  }

  if (!rows.length) {
    return <></>
  } else {
    return (
      <Card>
        <CardHeader title={title} />
        <div className='overflow-x-auto'>
          <table className={tableStyles.table} style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                {[
                  dictionary?.placeholders?.['object_name_ar'],
                  dictionary?.actions?.['print'],
                  dictionary?.actions?.['print_pdf'],
                  dictionary?.actions?.['print_excel'],
                  dictionary?.actions?.['search'],
                  dictionary?.actions?.['add'],
                  dictionary?.actions?.['edit'],
                  dictionary?.actions?.['delete'],
                  dictionary?.actions?.archive?.['open'],
                  dictionary?.actions?.archive?.['add'],
                  dictionary?.actions?.archive?.['delete'],
                  dictionary?.actions?.['audit_fields'],
                  dictionary?.actions?.['delete'],
                  dictionary?.actions?.['result']
                ].map((header, index) => (
                  <th
                    key={index}
                    className={`text-center ${index === 0 ? 'text-start' : ''}`}
                    style={{
                      padding: '4px 2px',
                      fontSize: '0.65rem',
                      width: index === 0 ? '160px' : index === 13 ? '40px' : 'auto',
                      minWidth: index === 0 ? '160px' : '30px',
                      whiteSpace: 'normal',
                      lineHeight: '1.2',
                      height: 'auto',
                      minHeight: '40px'
                    }}
                  >
                    <span>{header}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td
                    className='text-start'
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {row.label}
                  </td>
                  {[
                    'show',
                    'print_pdf',
                    'print_excel',
                    'index',
                    'store',
                    'update',
                    'destroy',
                    'archive_open',
                    'archive_add',
                    'archive_destroy',
                    'audit_fields'
                  ].map(field => (
                    <td className='text-center' key={field} style={{ padding: '0px' }}>
                      <Checkbox
                        size='small'
                        checked={row[field]}
                        disabled={row.hide && field !== 'hide'}
                        onChange={e => handleCheckboxChange(rowIndex, field, e.target.checked)}
                        sx={{ p: 0.5 }}
                      />
                    </td>
                  ))}
                  <td className='text-center' style={{ padding: '2px' }}>
                    <IconButton
                      size='small'
                      style={{ backgroundColor: 'red', color: 'white' }}
                      onClick={() => {
                        handleDelete(rowIndex)
                      }}
                      sx={{ width: 24, height: 24, p: 0 }}
                    >
                      <i className='ri-delete-bin-7-line' style={{ fontSize: '0.8rem' }} />
                    </IconButton>
                  </td>
                  {isRowUpdating(rowIndex) ? (
                    <td className='flex justify-center items-center' style={{ padding: '2px' }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: '2px solid rgba(25,118,210,0.2)',
                          borderTopColor: '#1976d2',
                          animation: 'spin 0.8s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                          }
                        }}
                      />
                    </td>
                  ) : (
                    <td className='text-center' style={{ padding: '2px' }}>
                      <Tooltip title={errors.find(error => error.rowIndex === rowIndex)?.message || ''}>
                        <IconButton
                          size='small'
                          style={{
                            backgroundColor: errors.some(error => error.rowIndex === rowIndex)
                              ? '#ff9600'
                              : row.success
                                ? '#8EE753'
                                : '#666CFF',
                            color: 'white',
                            width: 24,
                            height: 24,
                            padding: 0
                          }}
                        >
                          <i
                            style={{ fontSize: '0.8rem' }}
                            className={
                              errors.some(error => error.rowIndex === rowIndex)
                                ? 'ri-error-warning-line'
                                : row.success
                                  ? 'ri-check-line'
                                  : 'ri-info-i'
                            }
                          />
                        </IconButton>
                      </Tooltip>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }
}

export default RolesTable
