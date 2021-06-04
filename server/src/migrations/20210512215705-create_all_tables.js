module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      roleName: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('roles', [{
      id: '30559371-9774-463b-9c28-2c738d79b3dc',
      roleName: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 'b675969b-5ed1-4f56-a888-a96ee4874402',
      roleName: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    await queryInterface.createTable('departments', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      departmentName: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('departments', [{
      id: '23dde730-46cd-43bb-9a5b-e8a80c4f537b',
      departmentName: 'НХиТ',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 'a6fe5f87-4226-4bdb-bc61-f902703ab3f3',
      departmentName: 'ВХК',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: 'fb7aabd4-d8b0-41af-bb8f-ff2ec8f5dc7c',
      departmentName: 'ОХиТ',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: '8831d99c-cf18-4a4c-9b09-a74dc9af254e',
      departmentName: 'ТУ и Ци',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);

    await queryInterface.createTable('groups', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      course: {
        allowNull: false,
        type: Sequelize.STRING(1),
      },
      group: {
        allowNull: false,
        type: Sequelize.STRING(5),
      },
      departmentId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'departments',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      patronymic: {
        type: Sequelize.STRING(255),
      },
      dateBirth: {
        type: Sequelize.DATE,
      },
      placeWork: {
        type: Sequelize.STRING(255),
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      mail: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      login: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      aboutMe: {
        type: Sequelize.TEXT,
      },
      departmentId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'departments',
          key: 'id',
        },
      },
      roleId: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: 'b675969b-5ed1-4f56-a888-a96ee4874402',
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      customer: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      dateBegin: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      dateEnd: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      controlPoints: {
        type: Sequelize.TEXT,
      },
      result: {
        type: Sequelize.TEXT,
      },
      managerId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('vacancies', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      projectId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'projects',
          key: 'id',
        },
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      number: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      currentNumber: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      requirements: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable('vacancies_users', {
      vacancyId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'vacancies',
          key: 'id',
        },
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('vacancies_users');
    await queryInterface.dropTable('vacancies');
    await queryInterface.dropTable('projects');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('groups');
    await queryInterface.dropTable('departments');
    await queryInterface.dropTable('roles');
  },
};
