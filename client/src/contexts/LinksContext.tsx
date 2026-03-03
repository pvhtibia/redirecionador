import React, { createContext, useContext, useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

export interface RedirectLink {
  id: string;
  shortCode: string;
  name: string;
  targetUrl: string;
  createdAt: string;
  clicks: number;
}

interface LinksContextType {
  links: RedirectLink[];
  isLoaded: boolean;
  addLink: (name: string, targetUrl: string) => RedirectLink;
  deleteLink: (id: string) => void;
  updateLink: (id: string, name: string, targetUrl: string) => void;
  getLink: (shortCode: string) => RedirectLink | undefined;
  recordClick: (shortCode: string) => void;
}

const LinksContext = createContext<LinksContextType | undefined>(undefined);

const STORAGE_KEY = 'link-redirector-links';

export function LinksProvider({ children }: { children: React.ReactNode }) {
  const [links, setLinks] = useState<RedirectLink[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar links ao montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setLinks(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Erro ao carregar links:', error);
    }
    setIsLoaded(true);
  }, []);

  // Salvar links no localStorage sempre que mudarem
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
      } catch (error) {
        console.error('Erro ao salvar links:', error);
      }
    }
  }, [links, isLoaded]);

  const addLink = (name: string, targetUrl: string): RedirectLink => {
    const shortCode = nanoid(6);
    const newLink: RedirectLink = {
      id: nanoid(),
      shortCode,
      name,
      targetUrl,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };
    setLinks([...links, newLink]);
    return newLink;
  };

  const updateLink = (id: string, name: string, targetUrl: string) => {
    setLinks(links.map(link =>
      link.id === id
        ? { ...link, name, targetUrl }
        : link
    ));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const getLink = (shortCode: string): RedirectLink | undefined => {
    return links.find(link => link.shortCode === shortCode);
  };

  const recordClick = (shortCode: string) => {
    setLinks(links.map(link =>
      link.shortCode === shortCode
        ? { ...link, clicks: link.clicks + 1 }
        : link
    ));
  };

  return (
    <LinksContext.Provider value={{ links, isLoaded, addLink, deleteLink, updateLink, getLink, recordClick }}>
      {children}
    </LinksContext.Provider>
  );
}

export function useLinks() {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error('useLinks deve ser usado dentro de LinksProvider');
  }
  return context;
}

export function useLinksLoaded() {
  const { isLoaded } = useLinks();
  return isLoaded;
}
