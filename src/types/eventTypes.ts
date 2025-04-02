import {
  EventType,
  EventStatus,
  User,
  Venue,
  Match,
  LikeStatus,
} from "@prisma/client";
import { BaseEntity } from "./types";

// Event related types
export interface Event extends BaseEntity {
  hostId: string;
  name: string;
  description: string | null;
  type: EventType;
  date: Date;
  venueId: string;
  status: EventStatus;
  capacity: number;

  // Relations
  host?: User;
  venue?: Venue;
  eventLikes?: EventLike[];
  matches?: Match[];
}

export interface EventInput {
  hostId: string;
  name: string;
  description?: string;
  type: EventType;
  date: Date;
  venueId: string;
  status: EventStatus;
}

export interface EventUpdateInput {
  name?: string;
  description?: string;
  type?: EventType;
  date?: Date;
  venueId?: string;
  status?: EventStatus;
  capacity?: number;
}

// Event Like related types
export interface EventLike extends BaseEntity {
  userId: string;
  eventId: string;
  status: LikeStatus;
  message: string | null;

  // Relations
  user?: User;
  event?: Event;
}

export interface EventLikeInput {
  userId: string;
  eventId: string;
  message: string;
}

export interface EventFilters {
  type?: EventType;
  status?: EventStatus;
  venueId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
