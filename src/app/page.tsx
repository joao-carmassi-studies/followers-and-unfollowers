/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import { DataTableInstagram } from '@/components/table';
import { H1 } from '@/components/ui/h1';
import { Button } from '@/components/ui/button';
import { FileIcon, Trash } from 'lucide-react';

export default function Home() {
  const [followersFile, setFollowersFile] = useState<File | null>(null);
  const [followingFile, setFollowingFile] = useState<File | null>(null);

  const [followersJson, setFollowersJson] = useState<any[] | null>(null);
  const [followingJson, setFollowingJson] = useState<{
    relationships_following: any[];
  } | null>(null);

  const [followersValid, setFollowersValid] = useState(false);
  const [followingValid, setFollowingValid] = useState(false);

  const followersInputRef = useRef<HTMLInputElement>(null);
  const followingInputRef = useRef<HTMLInputElement>(null);

  function validarNomeArquivo(file: File, seed: string) {
    return file.name.toLowerCase().includes(seed.toLowerCase());
  }

  const handleFile = (file: File, tipo: 'followers' | 'following') => {
    if (
      (tipo === 'followers' && !validarNomeArquivo(file, 'followers_1.json')) ||
      (tipo === 'following' && !validarNomeArquivo(file, 'following.json'))
    ) {
      alert(`Arquivo ${file.name} não é válido para ${tipo}`);
      if (tipo === 'followers') {
        setFollowersFile(null);
        setFollowersValid(false);
      } else {
        setFollowingFile(null);
        setFollowingValid(false);
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (tipo === 'followers') {
          setFollowersJson(json);
          setFollowersFile(file);
          setFollowersValid(true);
        } else {
          setFollowingJson(json);
          setFollowingFile(file);
          setFollowingValid(true);
        }
      } catch {
        alert('JSON inválido ;-;');
        if (tipo === 'followers') {
          setFollowersFile(null);
          setFollowersValid(false);
        } else {
          setFollowingFile(null);
          setFollowingValid(false);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent, tipo: 'followers' | 'following') => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0], tipo);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleClickInput = (tipo: 'followers' | 'following') => {
    if (tipo === 'followers') followersInputRef.current?.click();
    else followingInputRef.current?.click();
  };

  const dadosCarregados = followersValid && followingValid;

  const FileDropZone = ({
    tipo,
    file,
    valid,
    inputRef,
    label,
  }: {
    tipo: 'followers' | 'following';
    file: File | null;
    valid: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    label: string;
  }) => (
    <div
      onDrop={(e) => handleDrop(e, tipo)}
      onDragOver={handleDragOver}
      onClick={() => handleClickInput(tipo)}
      className={`cursor-pointer border-2 border-dashed border-primary/50 rounded-2xl p-6 w-full md:w-1/2 text-center flex flex-col items-center justify-center gap-2 transition-all duration-200
        ${
          valid
            ? 'border-green-500 bg-green-100'
            : 'border-muted bg-card hover:bg-muted/30'
        }
      `}
    >
      <input
        type='file'
        accept='.json'
        ref={inputRef}
        className='hidden'
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0], tipo);
        }}
      />
      <FileIcon
        className={`w-10 h-10 ${
          valid ? 'text-green-600' : 'text-muted-foreground'
        }`}
      />
      {file ? (
        <p className='text-green-700 font-medium'>{file.name} ✓</p>
      ) : (
        <p className='text-muted-foreground'>{label}</p>
      )}
    </div>
  );

  return (
    <section>
      <div className='p-6 md:px-12 flex flex-col items-center justify-center gap-6 md:gap-12 max-w-7xl mx-auto w-full min-h-svh'>
        <H1 className='text-center'>Followers and unfollowers</H1>

        {!dadosCarregados && (
          <div className='w-full flex flex-col gap-6 md:flex-row md:justify-center md:gap-12'>
            <FileDropZone
              tipo='followers'
              file={followersFile}
              valid={followersValid}
              inputRef={followersInputRef}
              label='Clique ou arraste o followers_1.json aqui'
            />
            <FileDropZone
              tipo='following'
              file={followingFile}
              valid={followingValid}
              inputRef={followingInputRef}
              label='Clique ou arraste o following.json aqui'
            />
          </div>
        )}

        {dadosCarregados && followersJson && followingJson && (
          <div className='gap-3 flex flex-col w-full'>
            <DataTableInstagram
              followers={followersJson}
              following={followingJson}
            />
            <Button
              effect='expandIcon'
              icon={Trash}
              iconPlacement='right'
              onClick={() => {
                setFollowersFile(null);
                setFollowingFile(null);
                setFollowersJson(null);
                setFollowingJson(null);
                setFollowersValid(false);
                setFollowingValid(false);
              }}
            >
              Resetar arquivos
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
