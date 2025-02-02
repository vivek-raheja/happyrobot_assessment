# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . . 

# Expose the correct port for Google Cloud Run
EXPOSE 8080

# Command to run the application
CMD ["node", "app.js"]
