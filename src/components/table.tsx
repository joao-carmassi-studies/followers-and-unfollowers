/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { P } from './ui/p';

type Pessoa = {
  nome: string;
  link: string;
  segueVc: boolean;
  vcSegue: boolean;
  segueDeVolta: boolean;
};

export function processarDados(
  followersJson: any[],
  followingJson: { relationships_following: any[] }
): Pessoa[] {
  const seguidores = followersJson.map(
    (item) => item.string_list_data[0].value
  );
  const seguindo = followingJson.relationships_following.map(
    (item) => item.string_list_data[0].value
  );

  const seguidoresSet = new Set(seguidores);
  const seguindoSet = new Set(seguindo);

  const todos = new Set([...seguidores, ...seguindo]);

  return Array.from(todos).map((nome) => {
    const segueVc = seguidoresSet.has(nome);
    const vcSegue = seguindoSet.has(nome);

    return {
      nome,
      link: `https://www.instagram.com/${nome}`,
      segueVc,
      vcSegue,
      segueDeVolta: segueVc && vcSegue,
    };
  });
}

const columns: ColumnDef<Pessoa>[] = [
  { accessorKey: 'nome', header: 'Nome' },
  {
    accessorKey: 'link',
    header: 'Link',
    cell: ({ row }) => (
      <a
        href={row.original.link}
        target='_blank'
        rel='noopener noreferrer'
        onMouseDown={(e) => {
          if (e.button === 1) e.preventDefault(); // Prevenir troca de aba no botão do meio
        }}
        onClick={(e) => {
          if (e.button === 1) {
            window.open(row.original.link, '_blank');
            e.preventDefault();
          }
        }}
        className='text-blue-500 underline'
      >
        {row.original.nome}
      </a>
    ),
  },
  {
    accessorKey: 'segueVc',
    header: 'Segue você',
    cell: ({ getValue }) => (getValue() ? 'Sim' : 'Não'),
  },
  {
    accessorKey: 'vcSegue',
    header: 'Você segue',
    cell: ({ getValue }) => (getValue() ? 'Sim' : 'Não'),
  },
  {
    accessorKey: 'segueDeVolta',
    header: 'Segue de volta',
    cell: ({ getValue }) => {
      const valor = getValue();
      return (
        <span className={valor ? '' : 'text-red-500 font-semibold'}>
          {valor ? 'Sim' : 'Não'}
        </span>
      );
    },
  },
];

interface DataTableInstagramProps {
  followers: any[];
  following: { relationships_following: any[] };
}

export function DataTableInstagram({
  followers,
  following,
}: DataTableInstagramProps) {
  const pessoas = useMemo(
    () => processarDados(followers, following),
    [followers, following]
  );

  const [filtro, setFiltro] = useState<
    'todos' | 'naoSegueDeVolta' | 'segueVc' | 'vcSegue'
  >('todos');

  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());

  const toggleSelecao = (nome: string) => {
    setSelecionadas((prev) => {
      const novo = new Set(prev);
      novo.has(nome) ? novo.delete(nome) : novo.add(nome);
      return novo;
    });
  };

  const dadosFiltrados = useMemo(() => {
    switch (filtro) {
      case 'naoSegueDeVolta':
        return pessoas.filter((p) => p.vcSegue && !p.segueVc);
      case 'segueVc':
        return pessoas.filter((p) => p.segueVc);
      case 'vcSegue':
        return pessoas.filter((p) => p.vcSegue);
      default:
        return pessoas;
    }
  }, [filtro, pessoas]);

  const table = useReactTable({
    data: dadosFiltrados,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='space-y-4 flex flex-col items-center justify-center w-full'>
      <div className='flex gap-2'>
        <Button onClick={() => setFiltro('todos')}>Todos</Button>
        <Button onClick={() => setFiltro('vcSegue')}>Você segue</Button>
        <Button onClick={() => setFiltro('segueVc')}>Segue você</Button>
        <Button
          onClick={() => setFiltro('naoSegueDeVolta')}
          variant={'destructive'}
        >
          Não segue de volta
        </Button>
      </div>

      <div className='text-sm text-muted-foreground'>
        <P>Total: {dadosFiltrados.length} pessoas</P>
      </div>
      <div className='overflow-hidden rounded-md border w-full shadow-sm'>
        <Table className='w-full bg-card'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const nome = row.original.nome;
                const selecionado = selecionadas.has(nome);

                return (
                  <TableRow
                    key={row.id}
                    className={selecionado ? 'bg-background' : ''}
                    onMouseDown={(e) => {
                      if (e.button === 0 || e.button === 1) {
                        e.preventDefault();
                        toggleSelecao(nome);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
