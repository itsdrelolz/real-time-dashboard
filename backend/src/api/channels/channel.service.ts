import { Channel } from "@prisma/client";
import {
  BasicChannelResponse,
  ChannelDetailsResponse,
  CreateChannelBody,
  UpdateChannelBody,
} from "../../types/channel.types";
import prisma from "@/utils/prismaClient";

class ChannelService {
  public async getChannelSummariesForUser(
    userId: string,
  ): Promise<BasicChannelResponse[]> {
    try {
      const channels = await prisma.channel.findMany({
        where: {
          project: {
            members: {
              some: { id: userId },
            },
          },
        },
      });
      return channels as BasicChannelResponse[];
    } catch (error) {
      console.error("Failed to get channel summaries for user", error);
      throw error;
    }
  }

  public async getChannelById(
    id: string,
  ): Promise<ChannelDetailsResponse | null> {
    try {
      const channel = await prisma.channel.findUnique({
        where: { id },
        include: { messages: { include: { author: true } } },
      });
      return channel as ChannelDetailsResponse;
    } catch (error) {
      console.error("Failed to get channel by id", error);
      throw error;
    }
  }

  public async createChannel(
    projectId: string,
    userId: string,
    data: CreateChannelBody,
  ): Promise<Channel> {
    try {
      // First verify that the user is the owner of the project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          creatorId: userId,
        },
      });

      if (!project) {
        throw new Error(
          "Unauthorized: Only project owners can create channels",
        );
      }

      const channel = await prisma.channel.create({
        data: {
          name: data.name,
          description: data.description,
          project: {
            connect: { id: projectId },
          },
        },
      });
      return channel;
    } catch (error) {
      console.error("Failed to create channel", error);
      throw error;
    }
  }

  public async updateChannel(
    projectId: string,
    channelId: string,
    userId: string,
    data: UpdateChannelBody,
  ): Promise<Channel> {
    try {
      // First verify that the user is the owner of the project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          creatorId: userId,
        },
      });

      if (!project) {
        throw new Error(
          "Unauthorized: Only project owners can update channels",
        );
      }

      // Verify that the channel belongs to this project
      const existingChannel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          projectId: projectId,
        },
      });

      if (!existingChannel) {
        throw new Error("Channel not found in this project");
      }

      const channel = await prisma.channel.update({
        where: { id: channelId },
        data: data,
      });
      return channel;
    } catch (error) {
      console.error("Failed to update channel", error);
      throw error;
    }
  }

  public async deleteChannel(channelId: string): Promise<Channel> {
    try {
      const channel = await prisma.channel.delete({
        where: { id: channelId },
      });
      return channel;
    } catch (error) {
      console.error("Failed to delete channel", error);
      throw error;
    }
  }

  public async getChannelsByProjectId(
    projectId: string,
  ): Promise<BasicChannelResponse[]> {
    try {
      const channels = await prisma.channel.findMany({
        where: { projectId },
      });
      return channels as BasicChannelResponse[];
    } catch (error) {
      console.error("Failed to get channels by project id", error);
      throw error;
    }
  }
}

export const channelService = new ChannelService();
