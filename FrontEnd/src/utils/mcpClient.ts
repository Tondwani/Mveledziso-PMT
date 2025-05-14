// import { useState, useEffect } from 'react';

// // MCP PostgreSQL interface
// interface MCPPostgresResponse<T> {
//   result: T;
//   error?: string;
// }

// // Custom hook for MCP PostgreSQL queries
// export function useMCPPostgresQuery<T>(sql: string): {
//   data: T | null;
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
// } {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refetchIndex, setRefetchIndex] = useState<number>(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetch('/api/mcp-postgres', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ sql }),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result: MCPPostgresResponse<T> = await response.json();

//         if (result.error) {
//           setError(result.error);
//         } else {
//           setData(result.result);
//         }
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An unknown error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [sql, refetchIndex]);

//   const refetch = () => setRefetchIndex(prev => prev + 1);

//   return { data, loading, error, refetch };
// }

// // Function to execute a one-time query without using a hook
// export async function executePostgresQuery<T>(sql: string): Promise<{ 
//   data: T | null; 
//   error: string | null 
// }> {
//   try {
//     const response = await fetch('/api/mcp-postgres', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ sql }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const result: MCPPostgresResponse<T> = await response.json();

//     if (result.error) {
//       return { data: null, error: result.error };
//     }

//     return { data: result.result, error: null };
//   } catch (err) {
//     return { 
//       data: null, 
//       error: err instanceof Error ? err.message : 'An unknown error occurred'
//     };
//   }
// } 