import { DataTypes, Model, Optional } from 'sequelize';
import { getDatabase } from '../database';

export enum BikeType {
  ROAD = 'road',
  MOUNTAIN = 'mountain',
  HYBRID = 'hybrid',
  COMMUTER = 'commuter',
  E_BIKE = 'e-bike',
  CARGO = 'cargo',
  GRAVEL = 'gravel',
  TRACK = 'track',
  BMX = 'bmx',
  FOLDING = 'folding',
  OTHER = 'other',
}

export enum FrameMaterial {
  CARBON = 'carbon',
  ALUMINUM = 'aluminum',
  STEEL = 'steel',
  TITANIUM = 'titanium',
  OTHER = 'other',
}

interface Components {
  [key: string]: {
    name: string;
    installDate?: string;
    milesSinceInstall?: number;
    condition?: string;
  };
}

export interface BikeAttributes {
  id: string;
  ownerId: string;
  nickname: string;
  make: string;
  model: string;
  year?: number;
  type: BikeType;
  frameMaterial?: FrameMaterial;
  color?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  estimatedValue?: number;
  photoUrls?: string[];
  isEbike: boolean;
  ebikeMotorType?: string;
  ebikeBatteryCapacityWh?: number;
  totalMiles: number;
  milesSinceLastService: number;
  lastServiceDate?: Date;
  nextServiceDueDate?: Date;
  nextServiceDueMiles?: number;
  components?: Components;
  isStolen: boolean;
  stolenReportedAt?: Date;
  isForSale: boolean;
  salePrice?: number;
  saleDescription?: string;
  insurancePolicyId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BikeCreationAttributes extends Optional<BikeAttributes, 'id' | 'createdAt' | 'updatedAt' | 'isEbike' | 'totalMiles' | 'milesSinceLastService' | 'isStolen' | 'isForSale'> {}

export class Bike extends Model<BikeAttributes, BikeCreationAttributes> implements BikeAttributes {
  public id!: string;
  public ownerId!: string;
  public nickname!: string;
  public make!: string;
  public model!: string;
  public year?: number;
  public type!: BikeType;
  public frameMaterial?: FrameMaterial;
  public color?: string;
  public serialNumber?: string;
  public purchaseDate?: Date;
  public purchasePrice?: number;
  public estimatedValue?: number;
  public photoUrls?: string[];
  public isEbike!: boolean;
  public ebikeMotorType?: string;
  public ebikeBatteryCapacityWh?: number;
  public totalMiles!: number;
  public milesSinceLastService!: number;
  public lastServiceDate?: Date;
  public nextServiceDueDate?: Date;
  public nextServiceDueMiles?: number;
  public components?: Components;
  public isStolen!: boolean;
  public stolenReportedAt?: Date;
  public isForSale!: boolean;
  public salePrice?: number;
  public saleDescription?: string;
  public insurancePolicyId?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Bike.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    make: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(BikeType)),
      allowNull: false,
    },
    frameMaterial: {
      type: DataTypes.ENUM(...Object.values(FrameMaterial)),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    serialNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    purchasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    estimatedValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    photoUrls: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    isEbike: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ebikeMotorType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ebikeBatteryCapacityWh: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalMiles: {
      type: DataTypes.DECIMAL(10, 1),
      defaultValue: 0,
    },
    milesSinceLastService: {
      type: DataTypes.DECIMAL(10, 1),
      defaultValue: 0,
    },
    lastServiceDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextServiceDueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextServiceDueMiles: {
      type: DataTypes.DECIMAL(10, 1),
      allowNull: true,
    },
    components: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    isStolen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    stolenReportedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isForSale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    salePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    saleDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    insurancePolicyId: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize: getDatabase(),
    tableName: 'Bikes',
    indexes: [
      { fields: ['ownerId'] },
      { fields: ['type'] },
      { fields: ['isForSale'] },
      { fields: ['serialNumber'] },
      { fields: ['isStolen'] },
    ],
  }
);

export default Bike;
