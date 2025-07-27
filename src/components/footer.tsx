'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { H3 } from './ui/h';
import { FileQuestionMark } from 'lucide-react';

/* eslint-disable react/no-unescaped-entities */
export function InstrucoesDownload() {
  return (
    <footer className='w-full bg-card'>
      <div className='p-6 md:p-12 max-w-7xl mx-auto text-sm text-muted-foreground flex flex-col gap-6'>
        <H3 className='text-center'>Ajuda para baixar os dados</H3>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              effect='expandIcon'
              icon={FileQuestionMark}
              iconPlacement='right'
              className='mx-auto'
            >
              Clique aqui para descobrir como baixar seus dados do Instagram
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Como baixar seus dados do Instagram</DialogTitle>
            </DialogHeader>
            <ol className='space-y-1 list-decimal list-inside mt-4 text-muted-foreground text-sm'>
              <li>Acesse as configurações do Instagram.</li>
              <li>
                Pesquise por <strong>"baixar"</strong> e clique em{' '}
                <strong>"Baixar suas informações"</strong>.
              </li>
              <li>
                Clique em <strong>"Baixar ou transferir informações"</strong>.
              </li>
              <li>Selecione a conta desejada.</li>
              <li>
                Escolha <strong>"Algumas das informações"</strong>.
              </li>
              <li>
                Marque apenas <strong>"Seguidores e seguindo"</strong> e clique
                em <strong>"Avançar"</strong>.
              </li>
              <li>
                Escolha <strong>"Baixar no dispositivo"</strong>.
              </li>
              <li>
                Altere:
                <ul className='list-disc ml-6 mt-1'>
                  <li>
                    <strong>Intervalo de datas</strong>: "Desde o início"
                  </li>
                  <li>
                    <strong>Formato</strong>: "JSON"
                  </li>
                </ul>
              </li>
              <li>
                Clique em <strong>"Criar arquivos"</strong>.
              </li>
              <li>
                Você receberá um e-mail do Instagram com o link de download.
              </li>
              <li>
                Baixe o <strong>.zip</strong>, extraia e localize:
                <ul className='list-disc ml-6 mt-1'>
                  <li>
                    <code>followers_1.json</code>
                  </li>
                  <li>
                    <code>following.json</code>
                  </li>
                </ul>
              </li>
              <li>Envie cada um nos campos correspondentes acima ;)</li>
            </ol>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
}
