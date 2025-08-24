// components/blog/BlogContentRenderer.tsx
'use client';

import { JSX } from "react";

interface TipTapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
  marks?: TipTapMark[];
}

interface TipTapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

interface BlogContentRendererProps {
  content: string | object;
}
// Define valid heading levels
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function BlogContentRenderer({ content }: BlogContentRendererProps) {

  if (typeof content === 'string') {
  return (
    <div 
      className="prose max-w-none" 
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}

  const contentData = content as { type: string; content?: TipTapNode[] };

  const renderNode = (node: TipTapNode, index: number): JSX.Element | null => {
    switch (node.type) {
      case 'heading': {
        const level = (node.attrs?.level as HeadingLevel) || 1;
        const HeadingTag = `h${level}` as const;
        
        return (
          <HeadingTag key={index} className="my-4 font-semibold">
            {node.content?.map((childNode, childIndex) => 
              renderNode(childNode, childIndex)
            )}
          </HeadingTag>
        );
      }
      
      case 'paragraph':
        return (
          <p key={index} className="my-3 leading-relaxed">
            {node.content?.map((childNode, childIndex) => 
              renderNode(childNode, childIndex)
            )}
          </p>
        );
      
      case 'text': {
        let element: JSX.Element = <span key={index}>{node.text}</span>;
        
        if (node.marks) {
          node.marks.forEach((mark) => {
            switch (mark.type) {
              case 'bold':
                element = <strong key={index}>{element}</strong>;
                break;
              case 'italic':
                element = <em key={index}>{element}</em>;
                break;
              case 'underline':
                element = <u key={index}>{element}</u>;
                break;
              default:
                break;
            }
          });
        }
        
        return element;
      }
      
      case 'bulletList':
        return (
          <ul key={index} className="my-4 list-disc list-inside space-y-1">
            {node.content?.map((childNode, childIndex) => 
              renderNode(childNode, childIndex)
            )}
          </ul>
        );
      
      case 'orderedList':
        return (
          <ol key={index} className="my-4 list-decimal list-inside space-y-1">
            {node.content?.map((childNode, childIndex) => 
              renderNode(childNode, childIndex)
            )}
          </ol>
        );
      
      case 'listItem':
        return (
          <li key={index} className="ml-4">
            {node.content?.map((childNode, childIndex) => 
              renderNode(childNode, childIndex)
            )}
          </li>
        );
      
      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-4 italic">
            {node.content?.map((childNode, childIndex) => 
              renderNode(childNode, childIndex)
            )}
          </blockquote>
        );
      
      default:
        console.warn(`Unhandled node type: ${node.type}`);
        return null;
    }
  };

  return (
    <div className="prose max-w-none">
      {contentData.content?.map((node, index) => renderNode(node, index))}
    </div>
  );
}