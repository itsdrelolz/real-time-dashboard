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
          workspace: {
            members: {
              some: { userId: userId },
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
    workspaceId: string,
    userId: string,
    data: CreateChannelBody,
  ): Promise<Channel> {
    try {
      // First verify that the user is the owner of the workspace
      const workspace = await prisma.workspace.findFirst({
        where: {
          id: workspaceId,
          creatorId: userId,
        },
      });

      if (!workspace) {
        throw new Error(
          "Unauthorized: Only workspace owners can create channels",
        );
      }

      const newChannel = await prisma.channel.create({
        data: {
          name: data.name,
          description: data.description,
          workspace: {
            connect: { id: workspaceId },
          },
        },
      });

      return newChannel;
    } catch (error) {
      console.error("Failed to create channel", error);
      throw error;
    }
  }

  public async updateChannel(
    workspaceId: string,
    channelId: string,
    userId: string,
    data: UpdateChannelBody,
  ): Promise<Channel> {
    try {
      // First verify that the user is the owner of the workspace
      const workspace = await prisma.workspace.findFirst({
        where: {
          id: workspaceId,
          creatorId: userId,
        },
      });

      if (!workspace) {
        throw new Error(
          "Unauthorized: Only workspace owners can update channels",
        );
      }

      // Verify that the channel belongs to this workspace
      const existingChannel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          workspaceId: workspaceId,
        },
      });

      if (!existingChannel) {
        throw new Error("Channel not found in this workspace");
      }

      const updatedChannel = await prisma.channel.update({
        where: { id: channelId },
        data: {
          name: data.name,
          description: data.description,
        },
      });

      return updatedChannel;
    } catch (error) {
      console.error("Failed to update channel", error);
      throw error;
    }
  }

  public async deleteChannel(
    workspaceId: string,
    channelId: string,
    userId: string,
  ): Promise<Channel> {
    try {
      // First verify that the user is the owner of the workspace
      const workspace = await prisma.workspace.findFirst({
        where: {
          id: workspaceId,
          creatorId: userId,
        },
      });

      if (!workspace) {
        throw new Error(
          "Unauthorized: Only workspace owners can delete channels",
        );
      }

      // Verify that the channel belongs to this workspace
      const existingChannel = await prisma.channel.findFirst({
        where: {
          id: channelId,
          workspaceId: workspaceId,
        },
      });

      if (!existingChannel) {
        throw new Error("Channel not found in this workspace");
      }

      const deletedChannel = await prisma.channel.delete({
        where: { id: channelId },
      });

      return deletedChannel;
    } catch (error) {
      console.error("Failed to delete channel", error);
      throw error;
    }
  }

  public async getChannelsByWorkspaceId(
    workspaceId: string,
  ): Promise<BasicChannelResponse[]> {
    try {
      const channels = await prisma.channel.findMany({
        where: { workspaceId },
      });
      return channels as BasicChannelResponse[];
    } catch (error) {
      console.error("Failed to get channels by workspace id", error);
      throw error;
    }
  }
}

export const channelService = new ChannelService();