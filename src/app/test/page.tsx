'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Alert } from '@mui/material';

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingYards, setCreatingYards] = useState(false);
  const [createResult, setCreateResult] = useState<any>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/inspect-yards');
      const result = await response.json();
      
      if (!result.success) {
        setError(result.error?.message || 'Failed to fetch data');
      } else {
        setData(result);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateYards = async () => {
    setCreatingYards(true);
    try {
      const response = await fetch('/api/create-initial-yards', {
        method: 'POST'
      });
      const result = await response.json();
      setCreateResult(result);
      if (result.success) {
        // Refresh the data after successful creation
        await fetchData();
      }
    } catch (err) {
      setCreateResult({ success: false, error: 'Failed to create yards' });
    } finally {
      setCreatingYards(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h4" color="error" gutterBottom>
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Yards Table Inspection
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Button 
          variant="contained" 
          onClick={handleCreateYards}
          disabled={creatingYards}
          sx={{ mb: 2 }}
        >
          {creatingYards ? 'Creating Yards...' : 'Create Initial Yards'}
        </Button>

        {createResult && (
          <Alert severity={createResult.success ? "success" : "error"} sx={{ mb: 2 }}>
            {createResult.message || createResult.error}
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Table Structure</Typography>
        <Typography variant="body1">
          {data?.tableStructure?.join(', ')}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Total Yards: {data?.yardsCount}</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {data?.tableStructure?.map((column: string) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.yards?.map((yard: any, index: number) => (
              <TableRow key={yard.id || index}>
                {data?.tableStructure?.map((column: string) => (
                  <TableCell key={`${yard.id}-${column}`}>
                    {typeof yard[column] === 'object' 
                      ? JSON.stringify(yard[column])
                      : yard[column]?.toString() || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
} 