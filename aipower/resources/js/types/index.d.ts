import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

// AETHER Types

export interface Message {
    id: number;
    chat_session_id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    meta_data?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface StrategyCard {
    project_name: string;
    tagline?: string;
    target_audience?: string;
    monetization_model?: string;
    mvp_features?: string[];
    niche?: string;
    problem_statement?: string;
    solution_concept?: string;
}

export interface Blueprint extends StrategyCard {
    id: number;
    user_id: number;
    chat_session_id: number;
    roadmap_json?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    chat_session?: ChatSession;
}

export interface ChatSession {
    id: number;
    user_id: number;
    title: string | null;
    status: 'active' | 'completed' | 'archived';
    created_at: string;
    updated_at: string;
    messages?: Message[];
    blueprint?: Blueprint | null;
}

